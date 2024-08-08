const express = require('express');
const router = express.Router();
const estoqueController = require('./estoqueController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/', estoqueController.listarProdutos);
router.post('/', estoqueController.criarProduto);
router.put('/:id', estoqueController.atualizarProduto);
router.delete('/:id', estoqueController.deletarProduto);

module.exports = router;
