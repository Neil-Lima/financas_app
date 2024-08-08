const Orcamento = require('./orcamentoModel');

const listarOrcamentos = async (usuarioId, ano, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Orcamento.find({ usuario: usuarioId, ano: ano })
    .populate('categoria')
    .sort({ mes: 1 })
    .skip(skip)
    .limit(limit);
};

const criarOrcamento = async (usuarioId, orcamentoData) => {
  return await Orcamento.create({ ...orcamentoData, usuario: usuarioId });
};

const atualizarOrcamento = async (id, orcamentoData, usuarioId) => {
  const orcamento = await Orcamento.findOne({ _id: id, usuario: usuarioId });
  if (!orcamento) {
    throw new Error('Orçamento não encontrado');
  }

  const alteracoes = [];
  for (const [key, value] of Object.entries(orcamentoData)) {
    if (orcamento[key] !== value) {
      alteracoes.push({
        campo: key,
        valorAntigo: orcamento[key],
        valorNovo: value
      });
    }
  }

  orcamentoData.historicoAlteracoes = [...orcamento.historicoAlteracoes, ...alteracoes];
  orcamentoData.valor_restante = orcamentoData.valor_planejado - orcamentoData.valor_atual;

  const orcamentoAtualizado = await Orcamento.findByIdAndUpdate(id, orcamentoData, { new: true });
  return orcamentoAtualizado;
};

const deletarOrcamento = async (id, usuarioId) => {
  const orcamento = await Orcamento.findOneAndDelete({ _id: id, usuario: usuarioId });
  if (!orcamento) {
    throw new Error('Orçamento não encontrado');
  }
};

const compararOrcamentosAnuais = async (usuarioId, anoAtual, anoAnterior) => {
  const orcamentosAtual = await Orcamento.find({ usuario: usuarioId, ano: anoAtual }).populate('categoria');
  const orcamentosAnterior = await Orcamento.find({ usuario: usuarioId, ano: anoAnterior }).populate('categoria');

  return { orcamentosAtual, orcamentosAnterior };
};

module.exports = { 
  listarOrcamentos, 
  criarOrcamento, 
  atualizarOrcamento, 
  deletarOrcamento,
  compararOrcamentosAnuais
};
