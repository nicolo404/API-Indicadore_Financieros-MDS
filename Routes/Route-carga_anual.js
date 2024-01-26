const express = require('express');
const router = express.Router();
const ControllerCargaAnual = require('../Controller/Controller-carga_anual');
const { obtenerDolaresAnual } = require('../Middleware/consumir-carga-anual');

// Endpoint POST que utiliza el middleware obternerDolaresAnual
router.post('/carga-anual', obtenerDolaresAnual, ControllerCargaAnual.postCargaAnual);

module.exports = router;

