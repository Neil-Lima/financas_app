
// usuarioRoute.js
const express = require('express');
const router = express.Router();
const usuarioController = require('./usuarioController');
const { authMiddleware } = require('../middleware/Middleware');

router.post('/register', usuarioController.criarUsuario);
router.post('/login', usuarioController.login);
router.get('/profile', authMiddleware, usuarioController.getUsuario);

module.exports = router;