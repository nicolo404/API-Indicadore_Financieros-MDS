const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: "10.200.5.37",
  user: 'usr_financiero',
  password: "?n-mR6%}`S`Qr(et<6",
  database: 'indicadoresFinancieros',
  timezone: 'America/Santiago',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000, // Ajusta según tus necesidades
});


const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (err.code === 'PROTOCOL_SEQUENCE_TIMEOUT' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
          // Manejar errores de tiempo de espera aquí
          console.error('Error de tiempo de espera al conectar a la base de datos:', err.message);
        } else {
          // Otros errores
          console.error('Error al conectar a la base de datos:', err.message);
        }
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}

//Obtener todas las tablas de la base de datos
function getTables() {
  return new Promise((resolve, reject) => {
    pool.query('SHOW TABLES', (err, result) => {
      if (err) {
        reject(err);
      } else {
        const tables = result.map(row => Object.values(row)[0]);
        resolve(tables);
        console.log('Tablas de la base de datos:', tables);
      }
    });
  });
}

module.exports = { getConnection, getTables}

