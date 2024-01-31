const express = require('express');
const router = express.Router();
const { obtenerCargaDia } = require('../Middleware/consumir-carga-dia');
const {obtenerCargaAnual} = require('../Middleware/consumir-carga-anual');
const tbl_valoresdiariosController = require('../Controller/Controller_carga');
const tbl_valoresanualesController = require('../Controller/Controller_cargaAnual');

router.post('/v1/cargaDiaActual', obtenerCargaDia, tbl_valoresdiariosController.postCargaDia);
router.post('/v1/cargaAnual', obtenerCargaAnual, tbl_valoresanualesController.postCargaAnual);

module.exports = router;