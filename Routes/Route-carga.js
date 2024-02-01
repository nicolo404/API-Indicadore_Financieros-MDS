const express = require('express');
const router = express.Router();
const { obtenerCargaDia } = require('../Middleware/consumir-carga-dia');
const {obtenerCargaAnual} = require('../Middleware/consumir-carga-anual');
const tbl_valoresdiariosController = require('../Controller/Controller_carga');
const tbl_valoresanualesController = require('../Controller/Controller_cargaAnual');
const sap = require('../ServicesSAP/CargaDiaria_sap');

router.post('/v1/cargaDiaActual', obtenerCargaDia, tbl_valoresdiariosController.postCargaDia);
router.post('/v1/cargaAnual', obtenerCargaAnual, tbl_valoresanualesController.postCargaAnual);
router.get('/v1/cargaDiaActual/pendientes', tbl_valoresdiariosController.getALLCargaDiaPendiente);
router.put('/v1/cargaDiaActual/:id', tbl_valoresdiariosController.updateEstadoCargaDia);
router.post('/v1/cargaDiaActual/sap', sap.loginSap);

module.exports = router;