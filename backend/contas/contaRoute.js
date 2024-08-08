const express = require('express');
const router = express.Router();
const contaController = require('./contaController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/', contaController.listarContas);
router.post('/', contaController.criarConta);
router.put('/:id', contaController.atualizarConta);
router.delete('/:id', contaController.deletarConta);

module.exports = router;
