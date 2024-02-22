const { json } = require('body-parser');
const Tbl_ValoresDiarios = require('../Model/Model-carga_dia');

class ControllerCargaMes {
    async postCargaMes(req, res) { 

    // almacenar el maximo id_SAP
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
                console.log(j)
                
                console.log("jsonCargaMes: ");

                const jsonCargaMes = {
                    fecha: req.informacionObtenida[i][nombreJson][j].Fecha,
                    tipoIndicador: nombreJson,
                    valorIndicador: req.informacionObtenida[i][nombreJson][j].Valor
                };
                //validar si en esa fecha ya existe el indicador
                await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.findByFechaAndTipoIndicador(jsonCargaMes.fecha, jsonCargaMes.tipoIndicador, async(err, result) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        }
                        if(result.length == 0){
                            console.log("Agregando: " + jsonCargaMes.tipoIndicador + " en la fecha: " + jsonCargaMes.fecha);
                            await new Promise((resolve, reject) => {
                            Tbl_ValoresDiarios.create(jsonCargaMes, (err, result) => {
                                if (err) {
                                    console.log("Error al Guardar Carga Dia ")
                                    console.error(err);
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                            });
                            // Insertar en SAP
                            for(let k = 0; k < MaxID_SAP[0]["MAX(id_db)"]; k++){
                                const nuevoSAP = {
                                    fecha: jsonCargaMes.fecha,
                                    tipoIndicador: jsonCargaMes.tipoIndicador,
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
                            resolve(false)
                        }
                        else {
                            console.log("Ya existe el indicador: "+jsonCargaMes.tipoIndicador+" en la fecha: "+jsonCargaMes.fecha);
                            resolve(true);   
                        }
                    });
                });  
            }
            
        }catch (error) {
            
        }
    }
    res.send("ok");
}

}
module.exports = new ControllerCargaMes();

       