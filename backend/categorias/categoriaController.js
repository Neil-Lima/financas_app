const categoriaService = require('./categoriaService');

const listarCategorias = async (req, res) => {
  try {
    const categorias = await categoriaService.listarCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarCategoria = async (req, res) => {
  try {
    const categoria = await categoriaService.criarCategoria(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarCategoria = async (req, res) => {
  try {
    const categoria = await categoriaService.atualizarCategoria(req.params.id, req.body);
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const excluirCategoria = async (req, res) => {
  try {
    await categoriaService.excluirCategoria(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { listarCategorias, criarCategoria, atualizarCategoria, excluirCategoria };
