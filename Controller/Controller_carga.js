const Tbl_ValoresDiarios = require('../Model/Model-carga_dia');
const { obtenerCargaDia } = require('../Middleware/consumir-carga-dia');

class Controller_carga_dia_sql {
    async executeCargaDia() {
        const { indicadoresCarga } = {
            "indicadoresCarga": ["DolaR", "uF", "EuRO"]
        };
        const informacionObtenida = await obtenerCargaDia();
        try {
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
            // Recorrer el arreglo de indicadores
            for (let i = 0; i < indicadoresCarga.length; i++) {

                const nombreJson = Object.keys(informacionObtenida[i])[0];
                // Crear Json con la informacion obtenida
                const cargaDia = {
                    fecha: informacionObtenida[i][nombreJson][0].Fecha,
                    tipoIndicador: nombreJson,
                    valorIndicador: informacionObtenida[i][nombreJson][0].Valor
                    //id_SAP: null
                };
                // Validar que cargaDia no exista en la base de datos local
                await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.findByFechaAndTipoIndicador(cargaDia.fecha, cargaDia.tipoIndicador, async (err, result) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else if (result.length > 0) {
                            console.log("ya existe: " + cargaDia.tipoIndicador + " en la fecha: " + cargaDia.fecha);
                            // Salir de esta función
                            resolve(result);
                        } else if (result.length == 0) {
                            console.log("Agregando: " + cargaDia.tipoIndicador + " en la fecha: " + cargaDia.fecha);
                            // Guardar en la tabla de valores diarios
                            await new Promise((resolve, reject) => {
                            Tbl_ValoresDiarios.create(cargaDia, (err, result) => {
                                if (err) {
                                    console.log("Error al Guardar Carga Dia ")
                                    console.error(err);
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                            });
                            //crear SAP
                            for(let k = 0; k < MaxID_SAP[0]["MAX(id_db)"]; k++){
                                //agregar if para que si es ipc o utm no se agregue a SAP
                                if(cargaDia.tipoIndicador != "IPCs" || cargaDia.tipoIndicador != "UTM"){
                                const nuevoSAP = {
                                    fecha: cargaDia.fecha,
                                    tipoIndicador: cargaDia.tipoIndicador,
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
                        }
                            resolve(result);
                        }
                    });
                });
            }
            console.log('Datos Diarios guardados en Maria DB exitosamente 📂');
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async getALLCargaDiaPendiente(req, res) {
        try {
            const cargasDia = await new Promise((resolve, reject) => {
                Tbl_ValoresDiarios.getCargasDiaEstadoPendiente((err, result) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            res.status(200).json({
                mensaje: 'Cargas Diarias Pendientes obtenidas exitosamente',
                cargasDia
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                mensaje: 'Error al obtener las cargas diarias pendientes',
            });
        }
    }
    updateEstadoCargaDia(req, res) {
        const { id } = req.params;
        const { Estado } = req.body;
        Tbl_ValoresDiarios.setEstadoCargaDia(id, Estado, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({
                    mensaje: 'Error al actualizar el estado de la carga diaria',
                });
            } else {
                res.status(200).json({
                    mensaje: 'Estado de la carga diaria actualizado exitosamente',
                    result
                });
            }
        });
    } 
}

module.exports = new Controller_carga_dia_sql();

