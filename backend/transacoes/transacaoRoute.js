const express = require('express');
const router = express.Router();
const transacaoController = require('./transacaoController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/', transacaoController.listarTransacoes);
router.post('/', transacaoController.criarTransacao);
router.put('/:id', transacaoController.atualizarTransacao);
router.delete('/:id', transacaoController.deletarTransacao);

module.exports = router;
