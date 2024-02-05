const axios = require('axios');
const https = require('https');
const Tbl_ValoresDiarios = require('../Model/Model-carga_dia');
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
const loginSap = async () => {
    try {
        // Realizar la solicitud POST para iniciar sesión
        const response = await axios.post(loginEndpoint, loginData, axiosConfig);
        // Obtener las cookies del encabezado de la respuesta
        cookies = response.headers['set-cookie'];
        // Realizar la solicitud POST con las cookies en el encabezado
        // Ahora puedes continuar con el resto de tu lógica después de obtener la lista
        // verificarIndicadorSAP(cookies);
    } catch (error) {
        console.log("Error al realizar la solicitud POST para iniciar sesión");
        console.error("Error:", error.message);
    }
};

// Función para realizar la solicitud POST para verificar el indicador
const verificarIndicadorSAP = async () => {
    // Traer los valores diarios pendientes
    console.log("Valores Diarios Pendientes");
    
    try {
        const endpointVerificar = 'https://mds-thno-s014:50000/b1s/v1/SBOBobService_GetCurrencyRate';
        const cargasPendientes = await obtenerCargasPendientes();
        for(let i = 0; i < cargasPendientes.length; i++){
            //guardar la fecha y el tipo de indicador
            const fecha = cargasPendientes[i].fecha;
            const tipoIndicador = cargasPendientes[i].tipoIndicador;
            const valor = cargasPendientes[i].valorIndicador;
            // formatear la fecha a formato SAP y el indicador a formato SAP
            const fechaSAP = fechaFormatoSAP(fecha);
            const tipoIndicadorSAP = monedaFormatoSAP(tipoIndicador);
            const valorSAP = valorMonedaFormatoSAP(valor);
            // Crear el JSON con la información del indicador
            const postData = {
                Currency: tipoIndicadorSAP,
                Date: fechaSAP,
            };
            // Realizar la solicitud POST con las cookies en el encabezado
            await axios.post(endpointVerificar, postData, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                headers: {
                    Cookie: cookies
                }
            })
            .then(response => {
                // Manejar la respuesta de la operación POST
                console.log(`${postData.Currency} en la fecha ${postData.Date} existe en la base de datos:`);
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error en la operación POST de verificar:");
                if(error.response.status == 400 && error.response.data.error.message.value == "Update the exchange rate"){
                    console.log("indicador: "+tipoIndicadorSAP+" no existe en la fecha: "+fechaSAP);
                    //insertar valor, fecha y moneda en la tabla SAP
                    //
                    //antes de insertar cambiar formato de la moneda 
                    const valorSAP = valorMonedaFormatoSAP(valor);
                    insertarMonedasSAP(tipoIndicadorSAP,fechaSAP,valorSAP);
                }
            });
        }
    } catch (error) {
        console.error("Error al obtener las cargas pendientes:", error);
    }
};
const obtenerCargasPendientes = async () => {
    try {
        const cargasPendientes = await new Promise((resolve, reject) => {
            Tbl_ValoresDiarios.getCargasDiaEstadoPendiente((err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(result);   
                }
            });
        });

        return cargasPendientes;

    }catch (error) {
        console.error("Error al obtener las cargas pendientes:", error);
    }
};
    // Funcion para realizar el post de insertar monedas en la tabla SAP de donde me logie
const insertarMonedasSAP = (tipoMoneda,fecha,valor) => {
    // crear el json con la informacion de la moneda
        const postData = {
            Currency: tipoMoneda,
            RateDate: fecha,
            Rate: valor
        };
        console.log("Post Data 2")
        console.log(postData);
        // Realizar la solicitud POST para insertar postData en la base de datos
            axios.post('https://mds-thno-s014:50000/b1s/v1/SBOBobService_SetCurrencyRate', postData, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                headers: {
                    Cookie: cookies
                }
            })
            .then(response => {
                // Manejar la respuesta de la operación POST
                console.log("Respuesta de la operación POST Insertar exitosa:");
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error en la operación POST de insertar a SAP:");
                console.error(error);
            });
}

// Funcion para pasar de '2024-01-31T00:00:00.000Z' a '20240131'
const fechaFormatoSAP = (fecha) => {
    return fecha.toISOString().split('T')[0].replace(/-/g, '');
};
// Funcion para pasar de 'Euros' a 'EUR', 'Dolares' a 'US$' y uf a 'UF'
const monedaFormatoSAP = (moneda) => {
    switch (moneda) {
        case 'Euros':
            return 'EUR';
        case 'Dolares':
            return 'US$';
        case 'UFs':
            return 'UF';
        default:
            return '';
    }
};

//funcion para cambiar el formate de el valor de la modena de 37.897 a 37897
const valorMonedaFormatoSAP = (valor) => {
    return valor.replace('.','');
};

module.exports = { loginSap, obtenerCargasPendientes, verificarIndicadorSAP};