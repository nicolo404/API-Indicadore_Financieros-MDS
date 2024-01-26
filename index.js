const {conexionDB} = require('./database/db-mongoDB');  
const express = require('express');
const axios = require('axios');
const routeCargaAnual = require('./Routes/Route-carga_anual'); 
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

// iniciar servidor
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

// conectar a la base de datos
conexionDB();



