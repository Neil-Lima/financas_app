const mongoose = require('mongoose');

const contaAPagarSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  descricao: {
    type: String,
    required: true,
    trim: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  vencimento: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'pago', 'atrasado'],
    default: 'pendente',
  },
}, { timestamps: true });

module.exports = mongoose.model('ContaAPagar', contaAPagarSchema);
