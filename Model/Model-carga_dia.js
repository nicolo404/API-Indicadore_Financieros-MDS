const getConnection = require('../database/db_sql').getConnection;

class Tbl_ValoresDiarios {
  
  create(newItem, callback) {
    getConnection().then((connection) => {
      connection.query('INSERT INTO ValoresDiarios SET ?', newItem, (err, result) => {
        connection.release();
        callback(err, result);
      });
    }).catch((error) => {
      if (error.connection) {
        error.connection.release();
      }
      callback(error, null);
    });
  }

  createSAP(newItem, callback) {
    getConnection().then((connection) => {
      connection.query('INSERT INTO SAP SET ?', newItem, (err, result) => {
        connection.release();
        callback(err, result);
      });
    }).catch((error) => {
      if (error.connection) {
        error.connection.release();
      }
      callback(error, null);
    });
  }

  ultimoID_SAP(callback) {
    getConnection().then((connection) => {
      connection.query('SELECT MAX(ID_SAP) AS ID_SAP FROM SAP', (err, result) => {
        connection.release();
        callback(err, result);
      });
    }).catch((error) => {
      if (error.connection) {
        error.connection.release();
      }
      callback(error, null);
    });
  }

  getCargasDiaEstadoPendiente(callback) {
    getConnection().then((connection) => {
      connection.query('SELECT * FROM ValoresDiarios V, SAP S WHERE S.Estado = "Pendiente" AND V.id_SAP = S.id_SAP', (err, result) => {
        connection.release();
        callback(err, result);
      });
    }).catch((error) => {
      if (error.connection) {
        error.connection.release();
      }
      callback(error, null);
    });
  }
  setEstadoCargaDia(id, estado, callback) {
    getConnection().then((connection) => {
      connection.query('UPDATE SAP SET Estado = ? WHERE id_SAP = ?', [estado, id], (err, result) => {
        connection.release();
        callback(err, result);
      });
    }).catch((error) => {
      if (error.connection) {
        error.connection.release();
      }
      callback(error, null);
    });
  }

  findByFechaAndTipoIndicador(fecha, tipoIndicador, callback) {
    getConnection().then((connection) => {
      connection.query('SELECT * FROM ValoresDiarios WHERE Fecha = ? AND TipoIndicador = ?', [fecha, tipoIndicador], (err, result) => {
        connection.release();
        callback(err, result);
      });
    }).catch((error) => {
      if (error.connection) {
        error.connection.release();
      }
      callback(error, null);
    });
  }
}  
module.exports = new Tbl_ValoresDiarios();