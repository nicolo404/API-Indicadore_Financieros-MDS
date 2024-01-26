const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Middleware que realiza una solicitud GET a otra ruta
const obtenerDolaresAnual = async (req, res, next) => {
    try {
      // Realizar una solicitud GET 
      const response = await axios.get(`https://api.sbif.cl/api-sbifv3/recursos_api/dolar/2023?apikey=${process.env.API_KEY}&formato=json`);
        // Guardar la informacion obtenida en el objeto req
      req.informacionObtenida = response.data;
  
      next();
    } catch (error) {
      next(error);
    }
  };

    module.exports = { obtenerDolaresAnual };