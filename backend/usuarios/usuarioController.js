// usuarioController.js
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const usuarioService = require('./usuarioService');

const criarUsuario = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      try {
        await connectDB();
      } catch {
        // se falhar, cai no 503 abaixo
      }
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Banco de dados indisponível. Tente novamente em instantes.' });
      }
    }
    const usuario = await usuarioService.criarUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      try {
        await connectDB();
      } catch {
        // se falhar, cai no 503 abaixo
      }
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Banco de dados indisponível. Tente novamente em instantes.' });
      }
    }
    const { token, usuario } = await usuarioService.login(req.body);
    res.json({ token, usuario });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getUsuario = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      try {
        await connectDB();
      } catch {
        // se falhar, cai no 503 abaixo
      }
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Banco de dados indisponível. Tente novamente em instantes.' });
      }
    }
    const usuario = await usuarioService.getUsuario(req.user.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { criarUsuario, login, getUsuario };
