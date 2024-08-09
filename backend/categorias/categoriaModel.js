const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['receita', 'despesa'],
    required: true,
  },
  subtipo: {
    type: String,
  },
});

module.exports = mongoose.model('Categoria', categoriaSchema);
