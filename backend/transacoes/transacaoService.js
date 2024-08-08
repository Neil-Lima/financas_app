const Transacao = require('./transacaoModel');
const Conta = require('../contas/contaModel');

const listarTransacoes = async (usuarioId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Transacao.find({ usuario: usuarioId })
    .populate('conta')
    .populate('categoria')
    .sort({ data: -1 })
    .skip(skip)
    .limit(limit);
};

const criarTransacao = async (usuarioId, transacaoData) => {
  const conta = await Conta.findOne({ _id: transacaoData.conta, usuario: usuarioId });
  if (!conta) {
    throw new Error('Conta não encontrada');
  }
  const transacao = await Transacao.create({ ...transacaoData, usuario: usuarioId });
  await atualizarSaldoConta(conta, transacao);
  return transacao;
};

const atualizarTransacao = async (id, transacaoData, usuarioId) => {
  const transacao = await Transacao.findOneAndUpdate(
    { _id: id, usuario: usuarioId },
    transacaoData,
    { new: true }
  );
  if (!transacao) {
    throw new Error('Transação não encontrada');
  }
  const conta = await Conta.findById(transacao.conta);
  await atualizarSaldoConta(conta, transacao);
  return transacao;
};

const deletarTransacao = async (id, usuarioId) => {
  const transacao = await Transacao.findOneAndDelete({ _id: id, usuario: usuarioId });
  if (!transacao) {
    throw new Error('Transação não encontrada');
  }
  const conta = await Conta.findById(transacao.conta);
  await reverterSaldoConta(conta, transacao);
};

const atualizarSaldoConta = async (conta, transacao) => {
  const valorAjustado = transacao.tipo === 'receita' ? transacao.valor : -transacao.valor;
  conta.saldo += valorAjustado;
  await conta.save();
};

const reverterSaldoConta = async (conta, transacao) => {
  const valorAjustado = transacao.tipo === 'receita' ? -transacao.valor : transacao.valor;
  conta.saldo += valorAjustado;
  await conta.save();
};

module.exports = { listarTransacoes, criarTransacao, atualizarTransacao, deletarTransacao };
