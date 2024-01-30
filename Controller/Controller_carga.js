const Tbl_ValoresDiarios = require('../Model/Model-carga');
const { getConnection } = require('../database/db_sql');

class Controller_carga_dia_sql {
    async postCargaDia(req, res) {
        const { indicadoresCarga } = req.body;

        try {
            for (let i = 0; i < indicadoresCarga.length; i++) {
                const nombreJson = Object.keys(req.informacionObtenida[i])[0];
                // Crear Json con la informacion obtenida
                const cargaDia = {
                    Fecha: req.informacionObtenida[i][nombreJson][0].Fecha,
                    TipoIndicador: nombreJson,
                    ValorIndicador: parseFloat(req.informacionObtenida[i][nombreJson][0].Valor.replace('.', '')) // Convert to float
                };
                console.log(cargaDia);
                // guardar en la base de datos mysql maria db
                await new Promise((resolve, reject) => {
                    Tbl_ValoresDiarios.create(cargaDia, (err, result) => {
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
                mensaje: 'Listo para guardar en la bdd',
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



/*
async create(req, res) {
        try {
        const newItem = req.body;
        console.log(newItem);
        const data = await Tbl_supervisor.create(newItem);
        res.json(data);
        } catch (error) {
        res.json(error);
        }
    }
*/