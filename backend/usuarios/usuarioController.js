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
    const { accessToken, refreshToken, usuario } = await usuarioService.login(req.body);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' });
    res.json({ accessToken, usuario });
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

const atualizarUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.atualizarUsuario(req.user.id, req.body);
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { criarUsuario, login, getUsuario, atualizarUsuario };
