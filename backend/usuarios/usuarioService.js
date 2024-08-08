const Usuario = require('./usuarioModel');
const { generateAccessToken, generateRefreshToken, hashPassword, comparePassword } = require('../auth/auth');
const { inicializarContasUsuario } = require('../contas/contaService');

const criarUsuario = async (userData) => {
  const { nome, email, senha } = userData;
  const hashedSenha = await hashPassword(senha);
  const usuario = await Usuario.create({ nome, email, senha: hashedSenha });
  await inicializarContasUsuario(usuario._id);
  return { id: usuario._id, nome: usuario.nome, email: usuario.email };
};

const login = async (credentials) => {
  const { email, senha } = credentials;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }
  const senhaValida = await comparePassword(senha, usuario.senha);
  if (!senhaValida) {
    throw new Error('Senha inválida');
  }
  const accessToken = generateAccessToken(usuario);
  const refreshToken = generateRefreshToken(usuario);
  usuario.refreshToken = refreshToken;
  await usuario.save();
  return { accessToken, refreshToken, usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email } };
};

const getUsuario = async (id) => {
  const usuario = await Usuario.findById(id).select('-senha -refreshToken');
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }
  return usuario;
};

const atualizarUsuario = async (id, userData) => {
  const usuario = await Usuario.findByIdAndUpdate(id, userData, { new: true }).select('-senha -refreshToken');
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }
  return usuario;
};

module.exports = { criarUsuario, login, getUsuario, atualizarUsuario };
