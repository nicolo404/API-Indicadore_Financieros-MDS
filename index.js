const {conexionDB} = require('./database/db-mongoDB'); 
const express = require('express');
const routeCargaAnual = require('./Routes/Route-carga'); 
const {getConnection} = require('./database/db_sql');
const {loginSap,obtenerCargasPendientes, verificarIndicadorSAP} = require('./ServicesSAP/CargaDiaria_sap');
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
app.use("/api",routeCargaAnual);
//conectar a mongoDB
//conexionDB();

//conectar a MariaDB

getConnection().then(() => {
    // Iniciar el servidor y escuchar peticiones HTTP
    app.listen(port, () => {
      console.log("Servidor corriendo en el puerto " + port);
    });
  }).catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

  // Iniciar sesión y realizar la operación POST
console.log('Iniciando sesión y realizando la operación POST...');

loginSap().then(() => {
  verificarIndicadorSAP();
}
).catch((error) => {
  console.error('Error al iniciar sesión y realizar la operación POST:', error);
});
