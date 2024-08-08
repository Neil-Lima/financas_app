const Categoria = require('./categoriaModel');

const categoriasPredefinidas = [
  { nome: 'Alimentação', tipo: 'despesa', subtipo: 'Essencial' },
  { nome: 'Moradia', tipo: 'despesa', subtipo: 'Essencial' },
  { nome: 'Transporte', tipo: 'despesa', subtipo: 'Essencial' },
  { nome: 'Saúde', tipo: 'despesa', subtipo: 'Essencial' },
  { nome: 'Educação', tipo: 'despesa', subtipo: 'Investimento' },
  { nome: 'Lazer', tipo: 'despesa', subtipo: 'Não essencial' },
  { nome: 'Vestuário', tipo: 'despesa', subtipo: 'Não essencial' },
  { nome: 'Salário', tipo: 'receita', subtipo: 'Fixo' },
  { nome: 'Investimentos', tipo: 'receita', subtipo: 'Variável' },
  { nome: 'Freelance', tipo: 'receita', subtipo: 'Variável' },
];

const inicializarCategorias = async () => {
  for (const categoria of categoriasPredefinidas) {
    await Categoria.findOneAndUpdate(
      { nome: categoria.nome },
      categoria,
      { upsert: true, new: true }
    );
  }
};

const listarCategorias = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Categoria.find()
    .sort({ nome: 1 })
    .skip(skip)
    .limit(limit);
};

const criarCategoria = async (categoriaData) => {
  return await Categoria.create(categoriaData);
};

const atualizarCategoria = async (id, categoriaData) => {
  const categoria = await Categoria.findByIdAndUpdate(id, categoriaData, { new: true, runValidators: true });
  if (!categoria) {
    throw new Error('Categoria não encontrada');
  }
  return categoria;
};

const excluirCategoria = async (id) => {
  const categoria = await Categoria.findByIdAndDelete(id);
  if (!categoria) {
    throw new Error('Categoria não encontrada');
  }
};

const inicializarModuloCategorias = async () => {
  await inicializarCategorias();
};

module.exports = { 
  inicializarModuloCategorias, 
  listarCategorias, 
  criarCategoria,
  atualizarCategoria,
  excluirCategoria
};
