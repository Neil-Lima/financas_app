const express = require('express');
const router = express.Router();
const orcamentoController = require('./orcamentoController');
const { authMiddleware, rateLimitMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);
router.use(rateLimitMiddleware);

router.get('/', orcamentoController.listarOrcamentos);
router.post('/', orcamentoController.criarOrcamento);
router.put('/:id', orcamentoController.atualizarOrcamento);
router.delete('/:id', orcamentoController.deletarOrcamento);
router.get('/comparar-anual', orcamentoController.compararOrcamentosAnuais);

module.exports = router;
