const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Middleware que realiza una solicitud GET a otra ruta
const obtenerCargaAnual = async (req, res, next) => {
    // Obtener el año de la carga 
    const { añoCarga } = req.body;
    console.log(añoCarga);
    //obtener el indicador de la carga
    const { indicadoresCarga } = req.body;
    //largo del arreglo de indicadores  de la carga
    const largoIndicadores = indicadoresCarga.length;
  
    try {
      // Realizar una solicitud GET por cada indicador de la carga
      // mensaje miestras se extrae la informacion
      console.log("Extrayendo informacion");

      let indicadores = [];
        for (let i = 0; i < largoIndicadores; i++) {

        const respuesta = await axios.get(`https://api.sbif.cl/api-sbifv3/recursos_api/${indicadoresCarga[i].toLowerCase()}/${añoCarga}?apikey=${process.env.API_KEY}&formato=json`);
        // Guardar la respuesta en el objeto req
        indicadores.push(respuesta.data);
        }
        console.log("Informacion obtenida");
        req.informacionObtenida = indicadores;
      next();
    } catch (error) {
      next(error);
    }
  };

    module.exports = { obtenerCargaAnual };
