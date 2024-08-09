const contaService = require('./contaService');

const listarContas = async (req, res) => {
  try {
    const contas = await contaService.listarContas(req.user.id);
    res.json(contas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarConta = async (req, res) => {
  try {
    const conta = await contaService.criarConta(req.user.id, req.body);
    res.status(201).json(conta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarConta = async (req, res) => {
  try {
    const conta = await contaService.atualizarConta(req.params.id, req.body);
    res.json(conta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarConta = async (req, res) => {
  try {
    await contaService.deletarConta(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { listarContas, criarConta, atualizarConta, deletarConta };
