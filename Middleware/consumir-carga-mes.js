const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Middleware que realiza una solicitud GET a otra ruta
const obtenerCargaMes = async (req, res, next) => {
        //obtener indicadores de la carga
        //obtener el indicador de la carga
    const { indicadoresCarga,añoCarga, mesCarga } = req.body || {
      "indicadoresCarga":[
          "DolaR","uF","EuRO"
      ]
  };
    try {
      // Realizar una solicitud GET por cada indicador de la carga
      // mensaje miestras se extrae la informacion       
      let indicadores = [];  
      for (let i = 0; i < indicadoresCarga.length; i++) {
        console.log("fdasfsa")
        console.log(`Obteniendo indicador ${indicadoresCarga[i]}...`);
            const respuesta = await axios.get(`https://api.sbif.cl/api-sbifv3/recursos_api/${indicadoresCarga[i].toLowerCase()}/${añoCarga}/${mesCarga}?apikey=${process.env.API_KEY}&formato=json`);   
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
    module.exports = { obtenerCargaMes };