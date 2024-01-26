//modelo de carga anual
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define el esquema para cada entrada individual de dólares
const esquemaDolar = new Schema({
    Valor: {
        type: String,
        required: true
    },
    Fecha: {
        type: Date,
        required: true
    }
});

// Define el esquema para el arreglo general "Dolares"
const esquemaCargaAnual = new Schema({
    Dolares: {
        type: [esquemaDolar], // Arreglo de objetos siguiendo el esquemaDolar
        required: true
    }
});


const CargaAnual = mongoose.model('CargaAnual', esquemaCargaAnual);

module.exports = CargaAnual;