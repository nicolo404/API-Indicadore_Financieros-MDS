const express = require('express');
const router = express.Router();
const { obtenerCargaDia } = require('../Middleware/consumir-carga-dia');

const {obtenerCargaMes} = require('../Middleware/consumir-carga-mes');
const tbl_valoresdiariosController = require('../Controller/Controller_carga');

const tbl_valoremesController = require('../Controller/Controller_cargaMes');
const sap = require('../ServicesSAP/CargaDiaria_sap');

router.post('/v1/cargaDiaActual', obtenerCargaDia, tbl_valoresdiariosController.postCargaDia);

router.post('/v1/cargaMes', obtenerCargaMes,tbl_valoremesController.postCargaMes);
router.get('/v1/cargaDiaActual/pendientes', tbl_valoresdiariosController.getALLCargaDiaPendiente);
router.put('/v1/cargaDiaActual/:id', tbl_valoresdiariosController.updateEstadoCargaDia);
router.post('/v1/cargaDiaActual/sap', sap.loginSap);

module.exports = router;