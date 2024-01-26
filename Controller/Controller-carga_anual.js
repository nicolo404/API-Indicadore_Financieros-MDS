//controlador de Model-carga_anual.js
const CargaAnual = require('../Model/Model-carga_anual');

const postCargaAnual = async (req, res) => {
    try {
        console.log(req.informacionObtenida);
        // crear un nuevo Objeto CargaAnual
        const nuevoDolar = new CargaAnual(req.informacionObtenida);
        // guardar en la base de datos
        await nuevoDolar.save();
        res.status(201).json({
            mensaje: 'Dolar guardado en la base de datos',
            dolar: nuevoDolar
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al guardar el dolar en la base de datos'
        });
    }
}

module.exports = { postCargaAnual };