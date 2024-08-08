const Financiamento = require('./financiamentoModel');

const listarFinanciamentos = async (usuarioId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Financiamento.find({ usuario: usuarioId })
    .sort({ data_inicio: -1 })
    .skip(skip)
    .limit(limit);
};

const criarFinanciamento = async (usuarioId, financiamentoData) => {
  return await Financiamento.create({ ...financiamentoData, usuario: usuarioId });
};

const atualizarFinanciamento = async (id, financiamentoData, usuarioId) => {
  const financiamento = await Financiamento.findOneAndUpdate(
    { _id: id, usuario: usuarioId },
    financiamentoData,
    { new: true, runValidators: true }
  );
  if (!financiamento) {
    throw new Error('Financiamento não encontrado');
  }
  return financiamento;
};

const deletarFinanciamento = async (id, usuarioId) => {
  const financiamento = await Financiamento.findOneAndDelete({ _id: id, usuario: usuarioId });
  if (!financiamento) {
    throw new Error('Financiamento não encontrado');
  }
};

module.exports = { listarFinanciamentos, criarFinanciamento, atualizarFinanciamento, deletarFinanciamento };
