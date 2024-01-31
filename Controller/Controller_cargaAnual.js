const Tbl_ValoresAnual = require('../Model/Model-carga_anual');

class Controller_carga_anual {

    async postCargaAnual(req, res) {
        const { indicadoresCarga } = req.body;
        try {
            // Eliminar todos los datos de la tabla antes de Guardar los valores
            await new Promise((resolve, reject) => {
                Tbl_ValoresAnual.deleteMany((err, result) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
            // Recorrer el arreglo de indicadores
            for (let i = 0; i < indicadoresCarga.length; i++) {
                const nombreJson = Object.keys(req.informacionObtenida[i])[0];
                // Crear Json con la informacion obtenida
                const cargaAnual = {
                    Fecha: req.informacionObtenida[i][nombreJson][0].Fecha,
                    TipoIndicador: nombreJson,
                    ValorIndicador: parseFloat(req.informacionObtenida[i][nombreJson][0].Valor.replace('.', ''))
                };
                console.log(cargaAnual);
                // Guardar en la base de datos mysql maria db
                await new Promise((resolve, reject) => {
                    Tbl_ValoresAnual.create(cargaAnual, (err, result) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
            }
            res.status(201).json({
                mensaje: 'Datos Anuales guardados en Maria DB exitosamente',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                mensaje: 'Error al guardar el dolar en la base de datos',
            });
        }
    }
}


module.exports = new Controller_carga_anual();