const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
// Middleware que realiza una solicitud GET a otra ruta
const obtenerCargaAnual = async (req, res, next) => {
    //obtener indicadores de la carga
    //obtener el indicador de la carga
    const { indicadoresCarga, añoCarga } = req.body
    try {
        // Realizar una solicitud GET por cada indicador de la carga
        // mensaje miestras se extrae la informacion       
        let indicadores = [];
        for (let i = 0; i < indicadoresCarga.length; i++) {
            console.log("Obteniendo información de: " + indicadoresCarga[i] + "...")
            const respuesta = await axios.get(`${process.env.URL_CARGA_SBIF}/${indicadoresCarga[i].toLowerCase()}/${añoCarga}?apikey=${process.env.API_KEY}&formato=json`);
            // Guardar la respuesta en el objeto req
            indicadores.push(respuesta.data);
        }
        req.informacionObtenida = indicadores;
        next();
    }
    catch (error) {
        next(error);
    }
};
module.exports = { obtenerCargaAnual };