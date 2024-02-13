const {conexionDB} = require('./database/db-mongoDB'); 
const express = require('express');
const routeCarga = require('./Routes/Route-carga'); 
const {getConnection} = require('./database/db_sql');
const {loginSap, verificarIndicadorSAP} = require('./ServicesSAP/CargaDiaria_sap');
const { obtenerCargaDia } = require('./Middleware/consumir-carga-dia');
const {postCargaDia, executeCargaDia} = require('./Controller/Controller_carga');
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












  
  

  
 
