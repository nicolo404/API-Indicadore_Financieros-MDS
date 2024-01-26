const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

conexionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a la base de datos mongo Atlas');
    } catch (error) {
        console.log('Error al conectarse a la base de datos', error);
    }
}

module.exports = { conexionDB };