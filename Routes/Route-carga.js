const express = require('express');
const router = express.Router();
const { obtenerCargaDia } = require('../Middleware/consumir-carga-dia');
const tbl_valoresdiariosController = require('../Controller/Controller_carga');
//router.post('/v1/cargaDia', obtenerCargaDia, ControllerCargaAnual.postCargaDia);
router.post('/v1/cargaDiaActual', obtenerCargaDia, tbl_valoresdiariosController.postCargaDia);

module.exports = router;