const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
// Middleware que realiza una solicitud GET a otra ruta
const obtenerCargaDia = async () => {
    const { indicadoresCarga } = {
        "indicadoresCarga": [
            "DolaR", "uF", "EuRO"
        ]
    };
    try {
        // Realizar una solicitud GET por cada indicador de la carga
        let indicadores = [];
        for (let i = 0; i < indicadoresCarga.length; i++) {
            const respuesta = await axios.get(`${process.env.URL_CARGA_SBIF}/${indicadoresCarga[i].toLowerCase()}?apikey=${process.env.API_KEY}&formato=json`);
            // Guardar la respuesta en un array
            indicadores.push(respuesta.data);
        }
        // Devolver la información obtenida
        return indicadores;
    } catch (error) {
        throw error;
    }
};
module.exports = { obtenerCargaDia };
