const estoqueService = require('./estoqueService');

const listarProdutos = async (req, res) => {
  try {
    const produtos = await estoqueService.listarProdutos(req.user.id);
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarProduto = async (req, res) => {
  try {
    const produto = await estoqueService.criarProduto(req.user.id, req.body);
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarProduto = async (req, res) => {
  try {
    const produto = await estoqueService.atualizarProduto(req.params.id, req.body);
    res.json(produto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarProduto = async (req, res) => {
  try {
    await estoqueService.deletarProduto(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { listarProdutos, criarProduto, atualizarProduto, deletarProduto };
