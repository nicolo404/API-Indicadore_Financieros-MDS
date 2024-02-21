const express = require('express');
const router = express.Router();
const { obtenerCargaDia } = require('../Middleware/consumir-carga-dia');
const {obtenerCargaMes} = require('../Middleware/consumir-carga-mes');
const {obtenerCargaAnual} = require('../Middleware/consumir-carga-anual');
const tbl_valoresdiariosController = require('../Controller/Controller_carga');
const tbl_valoremesController = require('../Controller/Controller_cargaMes');
const tbl_valoresanualController = require('../Controller/Controller_cargaAnual');
const sap = require('../ServicesSAP/CargaDiaria_sap');
const sapMes = require('../ServicesSAP/CargaMes_sap');
const sapAnual = require('../ServicesSAP/CargaAnual_sap'); 

router.post('/v1/cargaDiaActual', obtenerCargaDia, tbl_valoresdiariosController.postCargaDia);
router.post('/v1/cargaMes', obtenerCargaMes,tbl_valoremesController.postCargaMes);
router.post('/v1/cargaAnual', obtenerCargaAnual,tbl_valoresanualController.postCargaAnual);

router.get('/v1/cargaDiaActual/pendientes', tbl_valoresdiariosController.getALLCargaDiaPendiente);
router.put('/v1/cargaDiaActual/:id', tbl_valoresdiariosController.updateEstadoCargaDia);
router.post('/v1/cargaDiaActual/sap', sap.loginSap);
router.post('/v1/cargaMes/sap', sapMes.loginSap);
router.post('/v1/cargaAnual/sap', sapAnual.loginSap);
router.get('/v1/cargaDiaActual/sap/db', sap.bases_datosGet);
router.get('/v1/cargaDiaActual/sap/db/:id', sap.obtenerCargasPendientes);
router.post('/v1/cargaDiaActual/sap/cargardatos', sap.cargar_SAP);

module.exports = router;