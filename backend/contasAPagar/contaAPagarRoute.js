const express = require('express');
const router = express.Router();
const contaAPagarController = require('./contaAPagarController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/', contaAPagarController.listarContasAPagar);
router.post('/', contaAPagarController.criarContaAPagar);
router.put('/:id', contaAPagarController.atualizarContaAPagar);
router.patch('/:id', contaAPagarController.atualizarContaAPagar);
router.delete('/:id', contaAPagarController.deletarContaAPagar);

module.exports = router;
