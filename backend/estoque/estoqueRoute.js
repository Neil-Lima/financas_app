const express = require('express');
const router = express.Router();
const estoqueController = require('./estoqueController');
const { authMiddleware, rateLimitMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);
router.use(rateLimitMiddleware);

router.get('/', estoqueController.listarProdutos);
router.post('/', estoqueController.criarProduto);
router.put('/:id', estoqueController.atualizarProduto);
router.delete('/:id', estoqueController.deletarProduto);

module.exports = router;
