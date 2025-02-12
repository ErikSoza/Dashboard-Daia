import express from 'express';
import mysql from 'mysql2';

let db;
const app = express();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'airflow_db'
};

//si tienes problema con la conexion de la base de datos usa
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

function connectDatabase() {
  db = mysql.createConnection(dbConfig);

  // Intenta conectar a la base de datos
  db.connect(err => {
    if (err) {
      console.error('❌ Error conectando a la base de datos:', err);
      setTimeout(connectDatabase, 2000); // Intenta reconectar en 2 segundos
    } else {
      console.log('✅ Conectado a MySQL');
    }
  });

  // señala el tipo de error y reconecta si se pierde la conexión
  db.on('error', err => {
    console.error('⚠️ Error en la conexión de MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectDatabase(); // Reestablece la conexión si se pierde
    } else {
      throw err;
    }
  });
}

connectDatabase(); // Conectar a la base de datos

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo!' });
});

app.get('/data', (req, res) => {
  const q = 'SELECT id,json FROM datos_json';
  db.query(q, (err, data) => {
    if (err) return res.json({ error: err });
    return res.json({ data });
  });
});

app.listen(8800, () => {
  console.log('🚀 Conectado al servidor!');
});
