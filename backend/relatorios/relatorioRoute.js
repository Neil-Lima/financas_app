const express = require('express');
const router = express.Router();
const relatorioController = require('./relatorioController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/completo', relatorioController.getRelatorioCompleto);
router.get('/pdf', relatorioController.downloadPDF);

module.exports = router;
