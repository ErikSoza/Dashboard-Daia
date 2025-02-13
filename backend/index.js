import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 8800;

// Habilitar CORS para permitir peticiones desde React
app.use(cors());

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'airflow_db'
};

let db;

// Función para conectar a la base de datos con reconexión automática
function connectDatabase() {
  db = mysql.createConnection(dbConfig);

  db.connect(err => {
    if (err) {
      console.error('❌ Error conectando a MySQL:', err);
      setTimeout(connectDatabase, 2000); // Reintentar en 2 segundos
    } else {
      console.log('✅ Conectado a MySQL');
    }
  });

  db.on('error', err => {
    console.error('⚠️ Error en la conexión de MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectDatabase(); // Reestablece la conexión si se pierde
    } else {
      throw err;
    }
  });
}

connectDatabase(); // Conectar a MySQL al iniciar

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo!' });
});

// Endpoint para obtener datos de la tabla `datos_json`
app.get('/data', (req, res) => {
  const q = 'SELECT id, json FROM datos_json';

  db.query(q, (err, data) => {
    if (err) {
      console.error('⚠️ Error en la consulta SQL:', err);
      return res.status(500).json({ error: 'Error al obtener datos de MySQL' });
    }

    return res.json({ data });
  });
});

// Iniciar el servidor en el puerto 8800
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
