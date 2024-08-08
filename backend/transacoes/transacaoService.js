const Transacao = require('./transacaoModel');
const Conta = require('../contas/contaModel');

const listarTransacoes = async (usuarioId) => {
  return await Transacao.find({ usuario: usuarioId })
    .populate('conta')
    .populate('categoria')
    .sort({ data: -1 });
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

const atualizarTransacao = async (id, transacaoData) => {
  const transacao = await Transacao.findByIdAndUpdate(id, transacaoData, { new: true });
  if (!transacao) {
    throw new Error('Transação não encontrada');
  }
  const conta = await Conta.findById(transacao.conta);
  await atualizarSaldoConta(conta, transacao);
  return transacao;
};

const deletarTransacao = async (id) => {
  const transacao = await Transacao.findByIdAndDelete(id);
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
