const Tbl_ValoresDiarios = require('../Model/Model-carga_dia');

class Controller_carga_dia_sql {
    async postCargaDia(req, res) {
        const { indicadoresCarga } = req.body;
        try {
            // Recorrer el arreglo de indicadores
            for (let i = 0; i < indicadoresCarga.length; i++) {
                const nombreJson = Object.keys(req.informacionObtenida[i])[0];
                // Crear Json con la informacion obtenida
                const cargaDia = {
                    Fecha: req.informacionObtenida[i][nombreJson][0].Fecha,
                    TipoIndicador: nombreJson,
                    ValorIndicador: parseFloat(req.informacionObtenida[i][nombreJson][0].Valor.replace('.', '')),
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
                            console.log("ya existe: ");
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

                // Guardar en la tabla SAP
                await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.createSAP(nuevoSAP, (err, result) => {
                        if (err) {
                            console.error(err);
                            console.log("Error al crear SAP: ")
                            reject(err);
                        } else {
                            console.log("SAP creado: ")
                            resolve(result);
                        }
                    });
                });
                // Obtener el ultimo ID_SAP
                const ultimoID_SAP = await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.ultimoID_SAP((err, result) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
                // Agregar el ultimo ID_SAP al objeto cargaDia
                cargaDia.id_SAP = ultimoID_SAP[0].ID_SAP;
                // Guardar en la tabla VAlores Diarios
                await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.create(cargaDia, (err, result) => {
                        if (err) {
                            console.error(err);
                            console.log("Error al crear cargaDia: ")
                            reject(err);
                        } else {
                            console.log("CargaDia creado: ")
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
}

module.exports = new Controller_carga_dia_sql();

