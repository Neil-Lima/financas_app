const Estoque = require('./estoqueModel');

const listarProdutos = async (usuarioId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Estoque.find({ usuario: usuarioId })
    .sort({ nome: 1 })
    .skip(skip)
    .limit(limit);
};

const criarProduto = async (usuarioId, produtoData) => {
  return await Estoque.create({ ...produtoData, usuario: usuarioId });
};

const atualizarProduto = async (id, produtoData, usuarioId) => {
  const produto = await Estoque.findOneAndUpdate(
    { _id: id, usuario: usuarioId },
    produtoData,
    { new: true, runValidators: true }
  );
  if (!produto) {
    throw new Error('Produto não encontrado');
  }
  return produto;
};

const deletarProduto = async (id, usuarioId) => {
  const produto = await Estoque.findOneAndDelete({ _id: id, usuario: usuarioId });
  if (!produto) {
    throw new Error('Produto não encontrado');
  }
};

module.exports = { listarProdutos, criarProduto, atualizarProduto, deletarProduto };
