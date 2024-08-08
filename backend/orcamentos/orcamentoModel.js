// orcamentoModel.js
const mongoose = require('mongoose');

const orcamentoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
  valor_planejado: {
    type: Number,
    required: true,
  },
  valor_atual: {
    type: Number,
    required: true,
    default: 0,
  },
  mes: {
    type: Number,
    required: true,
  },
  ano: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Orcamento', orcamentoSchema);
