const Tbl_ValoresDiarios = require('../Model/Model-carga_dia');

class ControllerCargaMes {
    async postCargaAnual(req, res) { 
    // almacenar el maximo id_db (cantidad de bases de datos)
    const MaxID_SAP = await new Promise((resolve, reject) => {
        Tbl_ValoresDiarios.MaxID_SAP(async (err, result) => {
            if (err) {
                console.log("Error al obtener ultimo ID_SAP")
                console.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    }); 
    for(let i = 0; i < req.informacionObtenida.length; i++) {
        const nombreJson = Object.keys(req.informacionObtenida[i])[0];
        //otro for por cada moneda
        try {
            for(let j = 0; j < req.informacionObtenida[i][nombreJson].length; j++) { 
                // crear json con los datos de la moneda
                const jsonCargaAnual = {
                    fecha: req.informacionObtenida[i][nombreJson][j].Fecha,
                    tipoIndicador: nombreJson,
                    valorIndicador: req.informacionObtenida[i][nombreJson][j].Valor
                };
                //validar si en esa fecha ya existe el indicador
                await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.findByFechaAndTipoIndicador(jsonCargaAnual.fecha, jsonCargaAnual.tipoIndicador, async(err, result) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        }
                        if(result.length == 0){
                            console.log("Agregando: " + jsonCargaAnual.tipoIndicador + " en la fecha: " + jsonCargaAnual.fecha);
                            //carga en valores diarios
                            await new Promise((resolve, reject) => {
                                Tbl_ValoresDiarios.create(jsonCargaAnual, (err, result) => {
                                    if (err) {
                                        console.log("Error al Guardar Carga Dia ")
                                        console.error(err);
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                });
                                });
                            //carga en SAP
                            for(let k = 0; k < MaxID_SAP[0]["MAX(id_db)"]; k++){
                                const nuevoSAP = {
                                    fecha: jsonCargaAnual.fecha,
                                    tipoIndicador: jsonCargaAnual.tipoIndicador,
                                    Estado: 'Pendiente',
                                    id_db: k+1
                                };
                                await new Promise((resolve, reject) => {
                                    Tbl_ValoresDiarios.createSAP(nuevoSAP, (err, result) => {
                                        if (err) {
                                            console.log("Error al Guardar SAP ")
                                            console.error(err);
                                            reject(err);
                                        } else {
                                            resolve(result);
                                        }
                                    })
                                });
                            }
                            resolve(false);
                        }
                        else {
                            console.log("Ya existe el indicador en la fecha: "+jsonCargaAnual.fecha);
                            resolve(true);   
                        }
                    });
                });  
            }    
        }catch (error) {
        }
    }
    console.log("Carga Anual Realizada en tabla ValoresAnual y SAP 📂📈💵💸");
}
}
module.exports = new ControllerCargaMes();