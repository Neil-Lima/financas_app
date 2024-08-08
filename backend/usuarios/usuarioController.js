// usuarioController.js
const usuarioService = require('./usuarioService');

const criarUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.criarUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { token, usuario } = await usuarioService.login(req.body);
    res.json({ token, usuario });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuario(req.user.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { criarUsuario, login, getUsuario };
