const orcamentoService = require('./orcamentoService');

const listarOrcamentos = async (req, res) => {
  try {
    const { ano, page, limit } = req.query;
    const orcamentos = await orcamentoService.listarOrcamentos(req.user.id, ano, page, limit);
    res.json(orcamentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarOrcamento = async (req, res) => {
  try {
    const orcamento = await orcamentoService.criarOrcamento(req.user.id, req.body);
    res.status(201).json(orcamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarOrcamento = async (req, res) => {
  try {
    const orcamento = await orcamentoService.atualizarOrcamento(req.params.id, req.body, req.user.id);
    res.json(orcamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarOrcamento = async (req, res) => {
  try {
    await orcamentoService.deletarOrcamento(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const compararOrcamentosAnuais = async (req, res) => {
  try {
    const { anoAtual, anoAnterior } = req.query;
    const comparacao = await orcamentoService.compararOrcamentosAnuais(req.user.id, anoAtual, anoAnterior);
    res.json(comparacao);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  listarOrcamentos, 
  criarOrcamento, 
  atualizarOrcamento, 
  deletarOrcamento,
  compararOrcamentosAnuais
};
