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
  try {
    for (const categoria of categoriasPredefinidas) {
      await Categoria.findOneAndUpdate(
        { nome: categoria.nome },
        categoria,
        { upsert: true, new: true }
      );
    }
    
  } catch (error) {
    
  }
};

const listarCategorias = async () => {
  return await Categoria.find();
};

const criarCategoria = async (categoriaData) => {
  return await Categoria.create(categoriaData);
};

const atualizarCategoria = async (id, categoriaData) => {
  return await Categoria.findByIdAndUpdate(id, categoriaData, { new: true });
};

const excluirCategoria = async (id) => {
  return await Categoria.findByIdAndDelete(id);
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
