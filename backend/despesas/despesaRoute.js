const express = require('express');
const router = express.Router();
const despesaController = require('./despesaController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/', despesaController.listarDespesas);
router.post('/', despesaController.criarDespesa);
router.put('/:id', despesaController.atualizarDespesa);
router.delete('/:id', despesaController.deletarDespesa);

module.exports = router;
