const despesaService = require('./despesaService');

const listarDespesas = async (req, res) => {
  try {
    const despesas = await despesaService.listarDespesas(req.user.id);
    res.json(despesas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarDespesa = async (req, res) => {
  try {
    const despesa = await despesaService.criarDespesa(req.user.id, req.body);
    res.status(201).json(despesa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarDespesa = async (req, res) => {
  try {
    const despesa = await despesaService.atualizarDespesa(req.params.id, req.body);
    res.json(despesa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarDespesa = async (req, res) => {
  try {
    await despesaService.deletarDespesa(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { listarDespesas, criarDespesa, atualizarDespesa, deletarDespesa };
