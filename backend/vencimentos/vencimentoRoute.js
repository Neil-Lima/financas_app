const express = require('express');
const router = express.Router();
const vencimentoController = require('./vencimentoController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/', vencimentoController.listarVencimentos);

module.exports = router;
