const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./middleware/Middleware');

router.get('/', authMiddleware, (req, res) => {
  const lastSync = new Date().toISOString();
  res.json({ lastSync, message: 'Sincronização bem-sucedida' });
});

module.exports = router;
