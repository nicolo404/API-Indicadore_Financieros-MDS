const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define el esquema para el arreglo general "Dolares"
const esquemaResultados = new Schema({
    Valor: {
        type: String,
        required: true
    },
    Fecha: {
        type: Date,
        required: true
    }
});

const esquemaCargaAnual = new Schema({
    Dolares: {
        type: [esquemaResultados],
        required: true
    },
    UFs:{
        type: [esquemaResultados],
        required: true
    },
    UTMs:{
        type: [esquemaResultados],
        required: true
    },
    Euros:{
        type: [esquemaResultados],
        required: true
    },
    

});

const CargaAnual = mongoose.model('CargaAnual', esquemaCargaAnual);

module.exports = CargaAnual;