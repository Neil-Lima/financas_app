const mongoose = require('mongoose');

const estoqueSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  quantidade: {
    type: Number,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  fornecedor: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Estoque', estoqueSchema);
