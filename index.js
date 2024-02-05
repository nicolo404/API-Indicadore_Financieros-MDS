const {conexionDB} = require('./database/db-mongoDB'); 
const express = require('express');
const routeCarga = require('./Routes/Route-carga'); 
const {getConnection} = require('./database/db_sql');
const {loginSap, verificarIndicadorSAP} = require('./ServicesSAP/CargaDiaria_sap');
const { obtenerCargaDia } = require('./Middleware/consumir-carga-dia');
const {postCargaDia} = require('./Controller/Controller_carga');
const cron = require('node-cron'); 
const app = express();
const port = 3000;
const cors = require('cors');

//configurar dotenv
require('dotenv').config();
// configurar express para recibir json
app.use(express.json());
// configurar express para recibir urlencoded
app.use(express.urlencoded({ extended: true }));
//configurar el cors
app.use(cors());
// routes
app.use("/api", routeCarga);

//conectar a MariaDB

getConnection().then(() => {
    // Iniciar el servidor y escuchar peticiones HTTP
    app.listen(port, () => {
      console.log("Servidor corriendo en el puerto " + port);
    });
  }).catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

//hacer await login en sap cada 25 minutos y luego verificar cada 10 segundos si hay indicadores pendientes
cron.schedule('*/10 * * * * *', async () => {
    console.log('Verificar indicadores pendientes');
    await loginSap();
    await verificarIndicadorSAP();
  });


  
  

  
 
