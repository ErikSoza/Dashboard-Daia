from airflow import DAG
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.operators.python import PythonOperator
from airflow.providers.mysql.operators.mysql import MySqlOperator
from datetime import datetime, timedelta
import json
import os
from airflow.utils.dates import days_ago

DAG_ID = "extraer_s3_recuperacion"
S3_BUCKET = "sensor-pulsos-datos-filtrados"
LOCAL_DIR = os.path.dirname(os.path.abspath(__file__))
DATOS_DIR = os.path.join(LOCAL_DIR, "datos2")

os.makedirs(DATOS_DIR, exist_ok=True)

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2024, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

def obtener_ultima_ejecucion():
    archivos = sorted(os.listdir(DATOS_DIR))  # Listar archivos en el directorio de datos y ordenarlos
    json_files = [f for f in archivos if f.endswith(".json")] 
    
    if json_files:
        return json_files[-1].replace(".json", "")  # Retornar la fecha del último archivo
    return None

def extraer_s3_respaldo(**kwargs):
    s3_hook = S3Hook(aws_conn_id="aws_s3")
    ultima_ejecucion = obtener_ultima_ejecucion() 
    
    if ultima_ejecucion:
        ultima_fecha = datetime.strptime(ultima_ejecucion, "%Y-%m-%d-%H")
    else:
        ultima_fecha = datetime.utcnow() - timedelta(days=3)

    print(f"Buscando archivos desde: {ultima_fecha}")

    ahora = datetime.utcnow()
    datos_a_insertar = []

    while ultima_fecha <= ahora:
        s3_prefix = ultima_fecha.strftime("%Y/%m/%d/%H/")  # Prefijo de búsqueda en S3
        fecha_prefijo = ultima_fecha.strftime("%Y-%m-%d-%H")  # Prefijo de fecha para archivos locales
        local_json_file = os.path.join(DATOS_DIR, f"{fecha_prefijo}.json")  # Ruta del archivo local

        print("Fecha actual:", fecha_prefijo)
        print("Buscando archivos en S3:", s3_prefix)

        archivos = s3_hook.list_keys(bucket_name=S3_BUCKET, prefix=s3_prefix)  # Listar archivos en S3
        archivos_contenido = []  # Lista para almacenar el contenido de los archivos
        
        if archivos:
            for archivo in archivos:
                obj = s3_hook.get_key(archivo, bucket_name=S3_BUCKET)
                contenido = json.loads(obj.get()["Body"].read().decode("utf-8"))
                archivos_contenido.append(contenido)  # Agregar contenido del archivo a la lista

        if archivos_contenido: 
            with open(local_json_file, "w", encoding="utf-8") as f:
                json.dump(archivos_contenido, f, indent=4, ensure_ascii=False)  # Guardar contenido en archivo local
            
            print(f"Se han extraído {len(archivos_contenido)} archivos de S3 y guardado en {DATOS_DIR}.")
            datos_a_insertar.append((fecha_prefijo, archivos_contenido))  # Agregar contenido a la lista de datos a insertar
        
        ultima_fecha += timedelta(hours=1)

    kwargs['ti'].xcom_push(key='datos_a_insertar', value=datos_a_insertar)  # Guardar datos a insertar en XCom, para ser utilizados en la siguiente tarea

def insertar_datos_json(**kwargs):
    ti = kwargs['ti']
    datos_a_insertar = ti.xcom_pull(key='datos_a_insertar', task_ids='extraer_s3_respaldo')
    
    for fecha_prefijo, contenido_json in datos_a_insertar:
        dispositivos_registrados = set()
        query_insertar = []  # Lista para almacenar los queries a insertar

        for registro in contenido_json:
            dev_ui = registro.get("end_device_ids", {}).get("dev_eui", "NULL")
            if dev_ui != "NULL" and dev_ui not in dispositivos_registrados:
                query_verificar = f"""
                    INSERT IGNORE INTO dispositivos (dev_ui, nombre)
                    VALUES ('{dev_ui}', '{dev_ui}');
                """
                dispositivos_registrados.add(dev_ui)
                query_insertar.append(query_verificar)

        # Crear consulta de inserción de los datos JSON
        json_data = json.dumps(contenido_json, ensure_ascii=False)
        values_str = f"('{fecha_prefijo}', '{dev_ui}', '{json_data}')"
        query_insertar.append(f"""
            INSERT INTO datos_json (id, DevUI, json)
            VALUES {values_str}
            ON DUPLICATE KEY UPDATE json = VALUES(json);
        """)

        # Ejecutar las consultas
        for query in query_insertar:
            mysql_op_insertar = MySqlOperator(
                task_id=f"insertar_datos_{fecha_prefijo}",
                mysql_conn_id="mysql_airflow",
                sql=query
            )
            mysql_op_insertar.execute(context=kwargs)

with DAG(
    DAG_ID,
    default_args=default_args,
    schedule_interval=timedelta(minutes=5),
    catchup=False,
) as dag:

    crear_tabla_datos_task = MySqlOperator(
        task_id="crear_tabla_datos",
        mysql_conn_id="mysql_airflow",
        sql=""" 
        CREATE TABLE IF NOT EXISTS dispositivos (
            dev_ui VARCHAR(50) PRIMARY KEY,  
            nombre VARCHAR(100) NOT NULL DEFAULT ''
        );
        CREATE TABLE IF NOT EXISTS datos_json (
            id VARCHAR(255) PRIMARY KEY,
            DevUI VARCHAR(50),
            json JSON NOT NULL,  # Asegúrate de que el tipo de dato sea JSON en la base de datos
            FOREIGN KEY (DevUI) REFERENCES dispositivos(dev_ui) ON DELETE CASCADE
        );
        """
    )

    extraer_s3_task = PythonOperator(
        task_id="extraer_s3_respaldo",
        python_callable=extraer_s3_respaldo,
        provide_context=True
    )

    insertar_datos_task = PythonOperator(
        task_id="insertar_datos_json",
        python_callable=insertar_datos_json,
        provide_context=True
    )

    finalizar_task = PythonOperator(
        task_id="finalizar_proceso",
        python_callable=lambda: print("Proceso de recuperación finalizado.")
    )

crear_tabla_datos_task >> extraer_s3_task >> insertar_datos_task >> finalizar_task
