const axios = require('axios');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();
const Tbl_ValoresDiarios = require('../Model/Model-carga_dia');

const bases_datosGet = async (req,res) => {
        const base_datos = await new Promise((resolve, reject) => {
            Tbl_ValoresDiarios.getAllDBSAP((err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
      return base_datos;
}
//retorna en una ruta las cargas pendientes
const obtenerCargasPendientes = async (id_db,req,res) => {
    const cargasPendientes = await new Promise((resolve, reject) => {
        Tbl_ValoresDiarios.getSAPbyIDDB(id_db, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(result);
    });
    });
    return cargasPendientes;
};
const cargar_SAP = async (req,res) => {
    //traer las bases de datos de sap de la tabla DBSAP
    const base_datos = await bases_datosGet();
    //recorrer las bases de datos
    for(let i = 0; i < base_datos.length; i++){
        const id_db = base_datos[i].id_db;
        //Logearse con los datos de la bd id_db, si es correcto consultar por pendientes por cada base de datos
        const loginData = {
            CompanyDB: base_datos[i].NombreDb,
            UserName: base_datos[i].UserName,
            Password: base_datos[i].Password
        };
        try {
            // Realizar la solicitud POST para iniciar sesión
            const response = await axios.post(loginEndpoint, loginData, axiosConfig);
            // Obtener las cookies del encabezado de la respuesta
            cookies = response.headers['set-cookie'];
            console.log("Inicio de sesión exitoso en la base de datos: "+id_db);
            //consultar por las cargas pendientes de esta base de datos
            const cargasPendientesById = await obtenerCargasPendientes(id_db);
            console.log("cargas pendientes por id "+id_db+" : "+cargasPendientesById.length);
            //recorrer las cargas pendientes y validar si existen en SAP services
            for(let j = 0; j < cargasPendientesById.length; j++){
                console.log(cargasPendientesById[j]);
                await verificarIndicadorSAP(cargasPendientesById[j].fecha,cargasPendientesById[j].tipoIndicador,cargasPendientesById[j].valorIndicador, id_db,cookies);
            }
            
        } catch (error) {
            console.log("Error al realizar la solicitud POST para iniciar sesión en la base de datos: "+id_db);
            console.error("Error:", error.message);
        } 
    }
    console.log("Carga de pendientes finalizada");
    res.send("Carga de pendientes finalizada 💰📈");
}
// URL del endpoint de inicio de sesión
const loginEndpoint = process.env.SAP_LOGIN_ENDPOINT;
// Variable para almacenar las cookies
let cookies = [];
// Configuración de Axios
const axiosConfig = {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
};
// Función para realizar la solicitud POST para iniciar sesión
const loginSap = async (loginData, id_db) => {
    try {
        // Realizar la solicitud POST para iniciar sesión
        const response = await axios.post(loginEndpoint, loginData, axiosConfig);
        // Obtener las cookies del encabezado de la respuesta
        cookies = response.headers['set-cookie'];
        console.log("Inicio de sesión exitoso en la base de datos: "+id_db);
    } catch (error) {
        console.log("Error al realizar la solicitud POST para iniciar sesión en la base de datos: "+id_db);
        console.error("Error:", error.message);
    }
};
// Función para realizar la solicitud POST para verificar el indicador
const verificarIndicadorSAP = async (fecha, tipoIndicador, valor, id_db, cookies) => {
    // Traer los valores diarios pendientes
    try {
        const endpointVerificar = process.env.SAP_VERIFICAR_INDICADOR_ENDPOINT;
            // formatear la fecha a formato SAP y el indicador a formato SAP
            const fechaSAP = fechaFormatoSAP(fecha);
            const tipoIndicadorSAP = monedaFormatoSAP(tipoIndicador);
            const valorSAP = valorFormatoSAP(valor);
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
            .then(async (response) => {
                // Manejar la respuesta de la operación POST de validar el indicador
                console.log(`${postData.Currency} en la fecha ${postData.Date} existe en la base de datos:`);
                console.log(response.data);
                //actualizar estado de la carga en la tabla SAP a Estado = Cargado
                await new Promise((resolve, reject) => {
                Tbl_ValoresDiarios.setEstadoCargaDia(id_db, tipoIndicador , fechaSAP, (err, result) => {
                    if (err) {
                        console.error(err);
                        console.error("Error al actualizar el estado de la carga en la base de datos de SAP");
                    }
                    console.log("Estado de la carga actualizado en la base de datos de SAP");
                    resolve(result)
                });
                });
            }) 
            .catch(error => {
                if(error.response.data.error.message.value == "Invalid currency"){
                    console.log("Valores ingresados no son validos para la moneda: ");
                }
                if(error.response.status == 400 && error.response.data.error.message.value == "Update the exchange rate"){
                    console.log("indicador: "+tipoIndicadorSAP+" no existe en la fecha: "+fechaSAP+" en la base de datos de SAP (hay que agregar)");
                    insertarMonedasSAP(tipoIndicadorSAP,fechaSAP,valorSAP, id_db, cookies);
                }
            });
    } catch (error) {
        console.error("Error al verificar las cargas pendientes:", error);
    }
};
    // Funcion para realizar el post de insertar monedas en la tabla SAP de donde me logie
const insertarMonedasSAP = (tipoMoneda,fecha,valor, id_db, cookies) => {
    // crear el json con la informacion de la moneda
        const postData = {
            Currency: tipoMoneda,
            RateDate: fecha,
            Rate: valor
        };
        console.log(postData);
        // Realizar la solicitud POST para insertar postData en la base de datos
            axios.post(process.env.SAP_INSERTAR_ENDPOINT , postData, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                headers: {
                    Cookie: cookies
                }
            })
            .then(() => {
                // Manejar la respuesta de la operación POST
                console.log("Moneda insertada en la base de datos de SAP");
            }).then( async () => {
                //actualizar estado de la carga en la tabla SAP
                await new Promise((resolve, reject) => {
                Tbl_ValoresDiarios.setEstadoCargaDia(id_db, monedaFormatoSAP(tipoMoneda), fecha, (err, result) => {
                    if (err) {
                        console.error(err);
                    }
                    resolve(result)
                });
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
        case 'EUR':
            return 'Euros';
        case 'US$':
            return 'Dolares';
        case 'UF':
            return 'UFs';
        default:
            return '';
    }
};
module.exports = {loginSap, verificarIndicadorSAP,bases_datosGet,obtenerCargasPendientes, cargar_SAP};