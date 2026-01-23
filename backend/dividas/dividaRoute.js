const express = require('express');
const router = express.Router();
const dividaController = require('./dividaController');
const { authMiddleware } = require('../middleware/Middleware');

router.use(authMiddleware);

router.get('/resumo', dividaController.getResumoDividas);

module.exports = router;
