const Tbl_ValoresDiarios = require('../Model/Model-carga_dia');
class Controller_carga_dia_sql {
    async postCargaDia(req, res) {
        const { indicadoresCarga } = req.body || {
            "indicadoresCarga":[
                "DolaR","uF","EuRO","ipc","utm"
            ]
        };
        try {
            // Recorrer el arreglo de indicadores
            for (let i = 0; i < indicadoresCarga.length; i++) {
                const nombreJson = Object.keys(req.informacionObtenida[i])[0];
                // Crear Json con la informacion obtenida
                const cargaDia = {
                    Fecha: req.informacionObtenida[i][nombreJson][0].Fecha,
                    TipoIndicador: nombreJson,
                    ValorIndicador: req.informacionObtenida[i][nombreJson][0].Valor,
                    id_SAP:null
                };
                // Validar que cargaDia no exista en la base de datos
                const existe = await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.findByFechaAndTipoIndicador(cargaDia.Fecha, cargaDia.TipoIndicador, (err, result) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } 
                        else if (result.length > 0) {
                            console.log("ya existe: "+cargaDia.TipoIndicador+" en la fecha: "+cargaDia.Fecha);
                            return res.status(400).json({
                                mensaje: 'El indicador y fecha ya existe en la base de datos',
                                result    
                            });   
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                //crear SAP
                const nuevoSAP = {
                    Fecha: cargaDia.Fecha,
                    Estado: 'Pendiente',
                };
                // Guardar en la tabla SAP
                
                await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.createSAP(nuevoSAP, (err, result) => {
                        if (err) {
                            console.log("Error al Guardar SAP ")
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
                
                // Obtener el ultimo ID_SAP
                const ultimoID_SAP = await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.ultimoID_SAP((err, result) => {
                        if (err) {
                            console.log("Error al obtener ultimo ID_SAP")
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
                // Agregar el ultimo ID_SAP al objeto cargaDia
                cargaDia.id_SAP = ultimoID_SAP[0].ID_SAP;
                // Guardar en la tabla Valores Diarios
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
            }
            res.status(201).json({
                mensaje: 'Datos Diarios guardados en Maria DB exitosamente',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                mensaje: 'Error al guardar el dolar en la base de datos',
            });
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

