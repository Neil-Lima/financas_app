const Categoria = require('./categoriaModel');

const categoriasPredefinidas = [
  { nome: 'Alimentação', tipo: 'despesa', subtipo: 'Essencial', icone: 'fa-utensils' },
  { nome: 'Moradia', tipo: 'despesa', subtipo: 'Essencial', icone: 'fa-home' },
  { nome: 'Transporte', tipo: 'despesa', subtipo: 'Essencial', icone: 'fa-car' },
  { nome: 'Saúde', tipo: 'despesa', subtipo: 'Essencial', icone: 'fa-medkit' },
  { nome: 'Educação', tipo: 'despesa', subtipo: 'Investimento', icone: 'fa-graduation-cap' },
  { nome: 'Lazer', tipo: 'despesa', subtipo: 'Não essencial', icone: 'fa-gamepad' },
  { nome: 'Vestuário', tipo: 'despesa', subtipo: 'Não essencial', icone: 'fa-tshirt' },
  { nome: 'Pet', tipo: 'despesa', subtipo: 'Essencial', icone: 'fa-paw' },
  { nome: 'Salário', tipo: 'receita', subtipo: 'Fixo', icone: 'fa-money-bill-wave' },
  { nome: 'Investimentos', tipo: 'receita', subtipo: 'Variável', icone: 'fa-chart-line' },
  { nome: 'Freelance', tipo: 'receita', subtipo: 'Variável', icone: 'fa-laptop-code' },
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
    console.error('Erro ao inicializar categorias:', error);
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
