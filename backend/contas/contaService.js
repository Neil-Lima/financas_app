const Conta = require('./contaModel');

const inicializarContasUsuario = async (usuarioId) => {
  const contasPadrao = [
    { nome: 'Conta Corrente', tipo: 'corrente', saldo: 0 },
    { nome: 'Poupança', tipo: 'poupança', saldo: 0 },
    { nome: 'Investimentos', tipo: 'investimento', saldo: 0 },
  ];

  for (const conta of contasPadrao) {
    await Conta.findOneAndUpdate(
      { nome: conta.nome, usuario: usuarioId },
      { ...conta, usuario: usuarioId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
};

const listarContas = async (usuarioId) => {
  return await Conta.find({ usuario: usuarioId });
};

const criarConta = async (usuarioId, contaData) => {
  return await Conta.create({ ...contaData, usuario: usuarioId });
};

const atualizarConta = async (id, contaData) => {
  return await Conta.findByIdAndUpdate(id, { ...contaData, updatedAt: new Date() }, { new: true });
};

const deletarConta = async (id) => {
  return await Conta.findByIdAndDelete(id);
};

module.exports = { 
  inicializarContasUsuario,
  listarContas, 
  criarConta,
  atualizarConta,
  deletarConta
};
