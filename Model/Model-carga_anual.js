const getConnection = require('../database/db_sql').getConnection;

class Tbl_ValoresAnual{
    create(newItem, callback) {
        getConnection().then((connection) => {
        connection.query('INSERT INTO ValoresAnual SET ?', newItem, (err, result) => {
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
    
    //obtener pendientes por año en particular
    getCargasAnualEstadoPendiente(año, callback) {
        getConnection().then((connection) => {
        connection.query('SELECT * FROM ValoresAnual V, SAP S WHERE S.Estado = "Pendiente" AND V.id_SAP = S.id_SAP AND YEAR(V.fecha) = ?', año, (err, result) => {
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

    setEstadoCargaAnual(idSAP, estado, callback) {
        getConnection().then((connection) => {
        connection.query('UPDATE SAP SET Estado = ? WHERE ID_SAP = ?', [estado, idSAP], (err, result) => {
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
        connection.query('SELECT * FROM ValoresAnual WHERE Fecha = ? AND TipoIndicador = ?', [fecha, tipoIndicador], (err, result) => {
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

module.exports = new Tbl_ValoresAnual();