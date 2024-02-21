const { json } = require('body-parser');
const Tbl_ValoresMes = require('../Model/Model-carga_dia');

class ControllerCargaMes {
    async postCargaMes(req, res) { 
    for(let i = 0; i < req.informacionObtenida.length; i++) {
        console.log("informacion obtenida: ")
        console.log(req.informacionObtenida[i]);
        const nombreJson = Object.keys(req.informacionObtenida[i])[0];
        //otro for por cada moneda
        try {
            for(let j = 0; j < req.informacionObtenida[i][nombreJson].length; j++) { 
                // crear json con los datos de la moneda
                //validar si en esa fecha ya existe el indicador
                await new Promise((resolve, reject) => {
                    Tbl_ValoresMes.findByFechaAndTipoIndicador(jsonCargaMes.Fecha, jsonCargaMes.TipoIndicador, async(err, result) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        }
                        if(result.length == 0){
                            console.log("No existe el indicador en la fecha: "+jsonCargaMes.Fecha);
                            console.log("jsonCargaMes: "+jsonCargaMes);
                            //crear sap por cada
                            /*
                            console.log("No existe el indicador en la fecha: "+jsonCargaMes.Fecha);
                            //crear sap
                            const nuevoSAP = {
                                Fecha: jsonCargaMes.Fecha,
                                Estado: 'Pendiente',
                            };
                            //insertar en sap
                            await new Promise((resolve, reject) => {
                                Tbl_ValoresMes.createSAP(nuevoSAP, (err, result) => {
                                    if (err) {
                                        console.log("Error al Guardar SAP ")
                                        console.error(err);
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                })
                            });
                            //obtener el id del sap
                            const ultimoID_SAP = await new Promise((resolve, reject) => {
                                Tbl_ValoresMes.ultimoID_SAP(async (err, result) => {
                                    if (err) {
                                        console.log("Error al obtener ultimo ID_SAP")
                                        console.error(err);
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                });
                            });
                            //asignar el id del sap al json
                            jsonCargaMes.id_SAP = ultimoID_SAP[0].ID_SAP;

                            Tbl_ValoresMes.create(jsonCargaMes, (err, result) => {
                                if (err) {
                                    console.log("Error al Guardar Carga Dia ")
                                    console.error(err);
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                            resolve(false);
                            */
                        }
                        else {
                            console.log("Ya existe el indicador en la fecha: "+jsonCargaMes.Fecha);
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

       