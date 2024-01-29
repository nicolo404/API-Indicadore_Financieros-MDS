//controlador de Model-carga_anual.js
const CargaAnual = require('../Model/Model-carga_anual');

const postCargaAnual = async (req, res) => {

    try {
        //informacion obtenida
        console.log("Informacion obtenida: ");
        console.log(req.informacionObtenida[2].UTMs);
        //crear un json con la informacion obtenida
        const cargaAnual = new CargaAnual({
            Dolares: req.informacionObtenida[0].Dolares,
            UFs: req.informacionObtenida[1].UFs,
            UTMs: req.informacionObtenida[2].UTMs,
            Euros: req.informacionObtenida[3].Euros
        });
        console.log("json creado: ");
        console.log(cargaAnual);
        //crear un nuevo documento en la base de datos
        await cargaAnual.save();
        res.status(201).json({
            mensaje: 'guardado en la base de datos MongoDB'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al guardar el dolar en la base de datos'
        });
    }

}

module.exports = { postCargaAnual };