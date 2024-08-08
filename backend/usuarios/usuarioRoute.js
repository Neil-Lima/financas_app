const express = require('express');
const router = express.Router();
const usuarioController = require('./usuarioController');
const { authMiddleware, rateLimitMiddleware } = require('../middleware/Middleware');

router.post('/register', rateLimitMiddleware, usuarioController.criarUsuario);
router.post('/login', rateLimitMiddleware, usuarioController.login);
router.get('/profile', authMiddleware, usuarioController.getUsuario);
router.put('/profile', authMiddleware, usuarioController.atualizarUsuario);

module.exports = router;
