const express = require('express');
const routeCarga = require('./Routes/Route-carga'); 
const {getConnection} = require('./database/db_sql');
const {cargar_SAP} = require('./ServicesSAP/CargaDiaria_sap');
const {executeCargaDia} = require('./Controller/Controller_carga');
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

// Configurar el servidor y conectar a la base de datos
getConnection().then(() => {
  // Iniciar el servidor
  app.listen(port, async () => {
      console.log("Servidor corriendo en el puerto " + port);
  });
}).catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
});

//cron carga diaria de datos a las 00:00
cron.schedule('0 0 * * *', async () => {
  try {
      // Ejecutar el método executeCargaDia del controlador
      await executeCargaDia();

      console.log('Cron job ejecutado con éxito.');
  } catch (error) {
      console.error('Error al ejecutar el cron job:', error);
  }
});

//cron carga de datos una vez al mes a las 00:00
cron.schedule('0 0 1 * *', async () => {
  try {
      // Ejecutar el método executeCargaDia del controlador
      await executeCargaDia();

      console.log('Cron job ejecutado con éxito.');
  } catch (error) {
      console.error('Error al ejecutar el cron job:', error);
  }
});

//login en sap todos los dias a las 02:00
cron.schedule('0 2 * * *', async () => {
  try {
      // Realizar el login en SAP y subida de valores
      await cargar_SAP();
      console.log('Cron job Login ejecutado con exito');
  } catch (error) {
      console.error('Error al ejecutar el cron job:', error);
  }
});
