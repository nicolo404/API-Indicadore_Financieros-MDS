const getConnection = require('../database/db_sql').getConnection;

class Tbl_ValoresAnual {
    
      create(newItem, callback) {
     getConnection().then((connection) => {
        connection.query('INSERT INTO ValoresAnual SET ?', newItem, (err, result) => {
          connection.release();
          callback(err, result);
        });
     }).catch((error) => {
        callback(error, null);
     });
    }
    
      deleteMany(callback) {
     getConnection().then((connection) => {
        connection.query('DELETE FROM ValoresAnual', (err, result) => {
          connection.release();
          callback(err, result);
        });
     }).catch((error) => {
        callback(error, null);
     });
    }
}

module.exports = new Tbl_ValoresAnual();