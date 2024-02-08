const Tbl_ValoresMes = require('../Model/Model-carga_mes');

class ControllerCargaMes {
    async postCargaMes(req, res) { 
    const { indicadoresCarga, añoCarga, mesCarga }
        = req.body || {
            "indicadoresCarga": [
                "DolaR", "uF", "EuRO"
            ]
        };
    for(let i = 0; i < req.informacionObtenida.length; i++) {
        const nombreJson = Object.keys(req.informacionObtenida[i])[0];
        //otro for por cada moneda
        console.log(nombreJson);
        console.log(req.informacionObtenida[i][nombreJson].length); 
        for(let j = 0; j < req.informacionObtenida[i][nombreJson].length; j++) { 
            // crear json con los datos de la moneda
            const jsonCargaMes = {
                Fecha: req.informacionObtenida[i][nombreJson][j].Fecha,
                TipoIndicador: nombreJson,
                ValorIndicador: req.informacionObtenida[i][nombreJson][j].Valor,
                id_SAP: null
            };
            //validar si en esa fecha ya existe el indicador
            await new Promise((resolve, reject) => { 
                Tbl_ValoresMes.findByFechaAndTipoIndicador(jsonCargaMes.Fecha, jsonCargaMes.TipoIndicador, async (err, result) => {
                    if (err) {
                        console.error(err);
                    }
                    else if (result.length > 0) {
                        console.log("ya existe: " + jsonCargaMes.TipoIndicador + " en la fecha: " + jsonCargaMes.Fecha);
                    }
                    else if (result.length === 0) {
                        //relizar todo el codigo de almacenar en la tabla sap local y en valoresMes
                        console.log("no existe: " + jsonCargaMes.TipoIndicador + " en la fecha: " + jsonCargaMes.Fecha);
                        //crear SAP
                        const nuevoSAP = {
                            Fecha: jsonCargaMes.Fecha,
                            Estado: 'Pendiente',
                        };
                        // Guardar en la tabla SAP
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
                        //obtener el ultimo id de SAP                       
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
                        //modificar cargaMes con el id de SAP
                        jsonCargaMes.id_SAP = ultimoID_SAP[0].ID_SAP;
                        console.log("Ultimo ID_SAP: "+ultimoID_SAP[0].ID_SAP); 
                        //guardar en la tabla carga mes
                        /*
                        await new Promise((resolve, reject) => {
                            Tbl_ValoresMes.create(jsonCargaMes, (err, result) => {
                                if (err) {
                                    console.log("Error al Guardar en ValoresMes ")
                                    console.error(err);
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        });*/
                        console.log("Carga de datos exitosa");
                    }
                });  
            });    
        }
    }
    //hay que hacer un doble for porq son varias monedas por indicador.... hacer mañana para realizar la carga mensual
    //miercoles 6/2 terminar la cargar mensual en tabla local sap y en el servicio de SAP..
    res.send("ok");
}

}
module.exports = new ControllerCargaMes();

       