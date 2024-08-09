const parcelamentoService = require('./parcelamentoService');

const listarParcelamentos = async (req, res) => {
  try {
    const parcelamentos = await parcelamentoService.listarParcelamentos(req.user.id);
    res.json(parcelamentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarParcelamento = async (req, res) => {
  try {
    const parcelamento = await parcelamentoService.criarParcelamento(req.user.id, req.body);
    res.status(201).json(parcelamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarParcelamento = async (req, res) => {
  try {
    const parcelamento = await parcelamentoService.atualizarParcelamento(req.params.id, req.body);
    res.json(parcelamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarParcelamento = async (req, res) => {
  try {
    await parcelamentoService.deletarParcelamento(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { listarParcelamentos, criarParcelamento, atualizarParcelamento, deletarParcelamento };
