const express = require('express');
const router = express.Router();
const financiamentoController = require('./financiamentoController');
const { authMiddleware, rateLimitMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);
router.use(rateLimitMiddleware);

router.get('/', financiamentoController.listarFinanciamentos);
router.post('/', financiamentoController.criarFinanciamento);
router.put('/:id', financiamentoController.atualizarFinanciamento);
router.delete('/:id', financiamentoController.deletarFinanciamento);

module.exports = router;
