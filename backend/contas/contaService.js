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

const listarContas = async (usuarioId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Conta.find({ usuario: usuarioId })
    .sort({ nome: 1 })
    .skip(skip)
    .limit(limit);
};

const criarConta = async (usuarioId, contaData) => {
  return await Conta.create({ ...contaData, usuario: usuarioId });
};

const atualizarConta = async (id, contaData, usuarioId) => {
  const conta = await Conta.findOneAndUpdate(
    { _id: id, usuario: usuarioId },
    contaData,
    { new: true, runValidators: true }
  );
  if (!conta) {
    throw new Error('Conta não encontrada');
  }
  return conta;
};

const deletarConta = async (id, usuarioId) => {
  const conta = await Conta.findOneAndDelete({ _id: id, usuario: usuarioId });
  if (!conta) {
    throw new Error('Conta não encontrada');
  }
};

module.exports = { 
  inicializarContasUsuario,
  listarContas, 
  criarConta,
  atualizarConta,
  deletarConta
};
