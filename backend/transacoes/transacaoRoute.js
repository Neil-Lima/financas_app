const express = require('express');
const router = express.Router();
const transacaoController = require('./transacaoController');
const { authMiddleware, rateLimitMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);
router.use(rateLimitMiddleware);

router.get('/', transacaoController.listarTransacoes);
router.post('/', transacaoController.criarTransacao);
router.put('/:id', transacaoController.atualizarTransacao);
router.delete('/:id', transacaoController.deletarTransacao);

module.exports = router;
