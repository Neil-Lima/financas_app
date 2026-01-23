// financiamentoService.js
const Financiamento = require('./financiamentoModel');

const listarFinanciamentos = async (usuarioId) => {
  return await Financiamento.find({ usuario: usuarioId });
};

const criarFinanciamento = async (usuarioId, financiamentoData) => {
  return await Financiamento.create({ ...financiamentoData, usuario: usuarioId });
};

const atualizarFinanciamento = async (id, financiamentoData) => {
  const financiamento = await Financiamento.findByIdAndUpdate(id, financiamentoData, { new: true });
  if (!financiamento) {
    throw new Error('Financiamento não encontrado');
  }
  return financiamento;
};

const deletarFinanciamento = async (id) => {
  const financiamento = await Financiamento.findByIdAndDelete(id);
  if (!financiamento) {
    throw new Error('Financiamento não encontrado');
  }
};

module.exports = { listarFinanciamentos, criarFinanciamento, atualizarFinanciamento, deletarFinanciamento };
