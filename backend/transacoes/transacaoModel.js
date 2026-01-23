const mongoose = require('mongoose');

const transacaoSchema = new mongoose.Schema({
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conta',
    required: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  tipo: {
    type: String,
    enum: ['receita', 'despesa'],
    required: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Transacao', transacaoSchema);
