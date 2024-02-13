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
        console.log("Inicio de sesión exitoso");
    } catch (error) {
        console.log("Error al realizar la solicitud POST para iniciar sesión");
        console.error("Error:", error.message);
    }
};
// Función para realizar la solicitud POST para verificar el indicador
const verificarIndicadorSAP = async () => {
    // Traer los valores diarios pendientes
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
            const valorSAP = valorFormatoSAP(valor);
            const idSAP = cargasPendientes[i].id_SAP;
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
                if(error.response.data.error.message.value == "Invalid currency"){
                    console.log("Valores ingresados no son validos para la moneda: ");
                }
                if(error.response.status == 400 && error.response.data.error.message.value == "Update the exchange rate"){
                    console.log("indicador: "+tipoIndicadorSAP+" no existe en la fecha: "+fechaSAP+" en la base de datos de SAP");
                    //insertar valor, fecha y moneda en la tabla SAP
                    //antes de insertar cambiar formato de la moneda 
                    insertarMonedasSAP(tipoIndicadorSAP,fechaSAP,valorSAP, idSAP);
                }
            });
        }
        console.log("Carga de datos exitosa");
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
                }
                if(result.length == 0){
                    console.log("No hay cargas pendientes");
                    resolve(result);
                }
                else {
                    console.log("Cargas Pendientes: "+result.length);
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
const insertarMonedasSAP = (tipoMoneda,fecha,valor, idSAP) => {
    // crear el json con la informacion de la moneda
        const postData = {
            Currency: tipoMoneda,
            RateDate: fecha,
            Rate: valor
        };
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
                
            }).then(() => {
                //actualizar estado de la carga
                Tbl_ValoresDiarios.setEstadoCargaDia(idSAP, "Cargado", (err, result) => {
                    if (err) {
                        console.error(err);
                    }
                });
            })
            .catch(error => {
                console.error("Error en la operación POST de insertar a SAP:");
                console.error(error.response.status);
                console.error(error.response.data.error.message.value);
            });
}

// Funcion para pasar de '2024-01-31T00:00:00.000Z' a '20240131'
const fechaFormatoSAP = (fecha) => {
    return fecha.toISOString().split('T')[0].replace(/-/g, '');
};
// Funcion para pasar de '36.697,42' a '36697.42'
const valorFormatoSAP = (valor) => {
    return valor.replace('.', '').replace(',', '.');
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
        case 'IPCs':
            return 'ipc';
        case 'UTMs':
            return 'utm';
        default:
            return '';
    }
};
module.exports = {loginSap, obtenerCargasPendientes, verificarIndicadorSAP};