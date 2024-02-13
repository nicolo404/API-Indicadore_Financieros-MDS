const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();
// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: ".....",
  user: '.....',
  password: ".....",
  database: '......',
  timezone: 'America/Santiago',
  waitForConnections: true,
  connectionLimit: 40,
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
module.exports = { getConnection}