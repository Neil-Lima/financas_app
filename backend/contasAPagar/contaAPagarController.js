const contaAPagarService = require('./contaAPagarService');

const listarContasAPagar = async (req, res) => {
  try {
    const contas = await contaAPagarService.listarContasAPagar(req.user.id);
    res.json(contas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarContaAPagar = async (req, res) => {
  try {
    const conta = await contaAPagarService.criarContaAPagar(req.user.id, req.body);
    res.status(201).json(conta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarContaAPagar = async (req, res) => {
  try {
    const conta = await contaAPagarService.atualizarContaAPagar(req.params.id, req.body);
    res.json(conta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarContaAPagar = async (req, res) => {
  try {
    await contaAPagarService.deletarContaAPagar(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  listarContasAPagar,
  criarContaAPagar,
  atualizarContaAPagar,
  deletarContaAPagar,
};
