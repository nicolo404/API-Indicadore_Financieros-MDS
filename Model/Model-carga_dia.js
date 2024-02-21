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
  getCargasDiaEstadoPendiente(callback) {
    getConnection().then((connection) => {
      connection.query('SELECT * FROM ValoresMes V, SAP S WHERE S.Estado = "Pendiente" AND V.id_SAP = S.id_SAP', (err, result) => {
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

  // consulta para traer todas las filas de la tabla DBSAP
  getAllDBSAP(callback) {
    getConnection().then((connection) => {
      connection.query('SELECT * FROM DBSAP', (err, result) => {
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

  // consulta para traer todas las filas de la tabla SAP en estado Pendiente y por id_db
  getSAPbyIDDB(id_db, callback) {
    getConnection().then((connection) => {
      connection.query('SELECT S.Estado , S.id_db, S.tipoIndicador, S.fecha , V.valorIndicador , D.NombreDb , D.UserName, D.Password  FROM SAP S, DBSAP D, ValoresDiarios V WHERE S.Estado = "Pendiente" AND S.id_db = D.id_db AND S.id_db = ? AND V.fecha = S.fecha AND V.tipoIndicador = S.tipoIndicador ', id_db, (err, result) => {
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