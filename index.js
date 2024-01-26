const {conexionDB} = require('./database/db-mongoDB');  
const express = require('express');
const app = express();
const port = 3000;

const myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
  }
  
  app.use(myLogger)
  
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

// iniciar servidor
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

// conectar a la base de datos
conexionDB();



