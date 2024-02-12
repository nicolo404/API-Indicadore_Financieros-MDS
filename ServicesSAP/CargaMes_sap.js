const axios = require('axios');
const https = require('https');
const Tbl_ValoresMes = require('../Model/Model-carga_mes');
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
const loginSap = async (req,res) => {
    const {mes,año}=req.body;
    try {
        // Realizar la solicitud POST para iniciar sesión
        const response = await axios.post(loginEndpoint, loginData, axiosConfig);
        // Obtener las cookies del encabezado de la respuesta
        cookies = response.headers['set-cookie'];
        // Realizar la solicitud POST con las cookies en el encabezado
        // Ahora puedes continuar con el resto de tu lógica después de obtener la lista
        InsertarServiceSAP(cookies, res,mes,año);
        console.log("Inicio de sesión exitoso");
    } catch (error) {
        console.log("Error al realizar la solicitud POST para iniciar sesión");
        console.error("Error:", error.message);
    }
};
// Función para realizar la solicitud POST para verificar el indicador
const InsertarServiceSAP = async (cookies, res, mes, año) => {
    // Traer los valores diarios pendientes
    try {
        const endpointVerificar = 'https://mds-thno-s014:50000/b1s/v1/SBOBobService_SetCurrencyRate';
        const cargasPendientes = await obtenerCargasPendientes(mes,año);
        if(cargasPendientes.length==0){
            res.status(200).json({message: "No hay datos pendientes en la fecha y mes ingresados"});
            return;
        }
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
                RateDate: fechaSAP,
                Rate: valorSAP
            };
            // Realizar la solicitud POST con las cookies en el encabezado
            try {
                console.log("Agregando a SAP "+postData.Currency+" "+postData.RateDate);
                await axios.post(endpointVerificar, postData, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                headers: {
                    Cookie: cookies
                }
                }).then(response => {
                    // Manejar la respuesta de la operación POST
                    Tbl_ValoresMes.setEstadoCargaDia(idSAP, "Cargado", (err, result) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                })
            } catch (error) {
                console.log("Error al agregar a SAP "+postData.Currency+" "+postData.Date);
            }
            
        }
        console.log("Carga de datos exitosa");
        res.status(200).json({message: "Carga de datos exitosa en el mes"+mes+" del año "+año});
    } catch (error) {
        console.error("Error al obtener las cargas pendientes:", error);
    }
        
};
const obtenerCargasPendientes = async (mes,año,res) => {
    try {
        const cargasPendientes = await new Promise((resolve, reject) => {
            Tbl_ValoresMes.getCargasMesEstadoPendiente(año, mes, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
        return cargasPendientes;
    }catch (error) {
        console.error("Error al obtener las cargas pendientes:", error);
    }
};

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



module.exports = {loginSap, obtenerCargasPendientes, InsertarServiceSAP};