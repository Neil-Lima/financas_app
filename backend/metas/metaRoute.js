const express = require('express');
const router = express.Router();
const metaController = require('./metaController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/', metaController.listarMetas);
router.post('/', metaController.criarMeta);
router.put('/:id', metaController.atualizarMeta);
router.delete('/:id', metaController.deletarMeta);
router.get('/estatisticas', metaController.obterEstatisticas);

module.exports = router;
