const getConnection = require('../database/db_sql').getConnection;

class Tbl_ValoresDiarios {
  
  create(newItem, callback) {
    getConnection().then((connection) => {
      connection.query('INSERT INTO ValoresDiarios SET ?', newItem, (err, result) => {
        connection.release();
        callback(err, result);
      });
    }).catch((error) => {
      callback(error, null);
    });
  }

  
}  

module.exports = new Tbl_ValoresDiarios();