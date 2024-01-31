const getConnection = require('../database/db_sql').getConnection;

class Tlb_SAP{
    create(newItem, callback) {
        getConnection().then((connection) => {
            connection.query('INSERT INTO SAP SET ?', newItem, (err, result) => {
                connection.release();
                callback(err, result);
            });
        }).catch((error) => {
            callback(error, null);
        });
    }
}