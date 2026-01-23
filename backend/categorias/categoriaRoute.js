const express = require('express');
const router = express.Router();
const categoriaController = require('./categoriaController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/', categoriaController.listarCategorias);
router.post('/', categoriaController.criarCategoria);
router.put('/:id', categoriaController.atualizarCategoria);
router.patch('/:id', categoriaController.atualizarCategoria);
router.delete('/:id', categoriaController.excluirCategoria);

module.exports = router;
