// financiamentoController.js
const financiamentoService = require('./financiamentoService');

const listarFinanciamentos = async (req, res) => {
  try {
    const financiamentos = await financiamentoService.listarFinanciamentos(req.user.id);
    res.json(financiamentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarFinanciamento = async (req, res) => {
  try {
    const financiamento = await financiamentoService.criarFinanciamento(req.user.id, req.body);
    res.status(201).json(financiamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarFinanciamento = async (req, res) => {
  try {
    const financiamento = await financiamentoService.atualizarFinanciamento(req.params.id, req.body);
    res.json(financiamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarFinanciamento = async (req, res) => {
  try {
    await financiamentoService.deletarFinanciamento(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { listarFinanciamentos, criarFinanciamento, atualizarFinanciamento, deletarFinanciamento };
