const axios = require('axios');
const https = require('https');
const controllerCargaDia = require('../Controller/Controller_carga');
// Datos de inicio de sesión en formato JSON
const loginData = {
    CompanyDB: "SBOMARINATEST",
    UserName: "integration",
    Password: "B1nt3gr4."
};
// URL del endpoint de inicio de sesión
const loginEndpoint = 'https://mds-thno-s014:50000/b1s/v1/Login';
// Variable para almacenar las cookies
let cookies = [];
// Configuración de Axios
const axiosConfig = {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};
// Función para realizar la solicitud POST para iniciar sesión
const loginSap = () => {
    // Realizar la solicitud POST para iniciar sesión
    axios.post(loginEndpoint, loginData, axiosConfig)
        .then(response => {
            // Obtener las cookies del encabezado de la respuesta
            cookies = response.headers['set-cookie'];
            //Realizar la solicitud POST con las cookies en el encabezado
            verificarIndicadorSAP(cookies)
        })
        .catch(error => {
            console.log("Error al realizar la solicitud POST para iniciar sesión");
            console.error("Error:", error.message);
        });
};

const verificarIndicadorSAP = (cookies) => {
    const postData = {
        Currency: "US$",
        Date: "20240101"
    };
    const endpointVerificar = 'https://mds-thno-s014:50000/b1s/v1/SBOBobService_GetCurrencyRate';

    //Realizar la solicitud POST con las cookies en el encabezado
    axios.post(endpointVerificar, postData, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
            Cookie: cookies
        }
    })
        .then(response => {
            // Manejar la respuesta de la operación POST
            console.log("Respuesta de la operación POST Validar exitosa:");
            console.log(response.data);
        })
        .catch(error => {
            console.error("Error en la operación POST de verificar:");
            console.error("Código de Estado:", error.response.status);
            console.error("Respuesta de Error:", error.response.data);
        });
};

module.exports = { loginSap};




