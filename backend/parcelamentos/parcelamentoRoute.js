const express = require('express');
const router = express.Router();
const parcelamentoController = require('./parcelamentoController');
const { authMiddleware, rateLimitMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);
router.use(rateLimitMiddleware);

router.get('/', parcelamentoController.listarParcelamentos);
router.post('/', parcelamentoController.criarParcelamento);
router.put('/:id', parcelamentoController.atualizarParcelamento);
router.delete('/:id', parcelamentoController.deletarParcelamento);

module.exports = router;
