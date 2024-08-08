const express = require('express');
const router = express.Router();
const categoriaController = require('./categoriaController');
const { authMiddleware, rateLimitMiddleware } = require('../middleware/Middleware');
const { inicializarModuloCategorias } = require('./categoriaService');

inicializarModuloCategorias();

router.use(authMiddleware);
router.use(rateLimitMiddleware);

router.get('/', categoriaController.listarCategorias);
router.post('/', categoriaController.criarCategoria);
router.put('/:id', categoriaController.atualizarCategoria);
router.delete('/:id', categoriaController.excluirCategoria);

module.exports = router;
