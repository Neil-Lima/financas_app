// orcamentoService.js
const Orcamento = require('./orcamentoModel');

const listarOrcamentos = async (usuarioId) => {
  return await Orcamento.find({ usuario: usuarioId }).populate('categoria');
};

const criarOrcamento = async (usuarioId, orcamentoData) => {
  return await Orcamento.create({ ...orcamentoData, usuario: usuarioId });
};

const atualizarOrcamento = async (id, orcamentoData) => {
  const orcamento = await Orcamento.findByIdAndUpdate(id, orcamentoData, { new: true });
  if (!orcamento) {
    throw new Error('Orçamento não encontrado');
  }
  return orcamento;
};

const deletarOrcamento = async (id) => {
  const orcamento = await Orcamento.findByIdAndDelete(id);
  if (!orcamento) {
    throw new Error('Orçamento não encontrado');
  }
};

module.exports = { listarOrcamentos, criarOrcamento, atualizarOrcamento, deletarOrcamento };
