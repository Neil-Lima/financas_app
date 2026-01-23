const Estoque = require('./estoqueModel');

const listarProdutos = async (usuarioId) => {
  return await Estoque.find({ usuario: usuarioId });
};

const criarProduto = async (usuarioId, produtoData) => {
  return await Estoque.create({ ...produtoData, usuario: usuarioId });
};

const atualizarProduto = async (id, produtoData) => {
  const produto = await Estoque.findByIdAndUpdate(id, produtoData, { new: true });
  if (!produto) {
    throw new Error('Produto não encontrado');
  }
  return produto;
};

const deletarProduto = async (id) => {
  const produto = await Estoque.findByIdAndDelete(id);
  if (!produto) {
    throw new Error('Produto não encontrado');
  }
};

module.exports = { listarProdutos, criarProduto, atualizarProduto, deletarProduto };
