const mongoose = require('mongoose');

const contaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  saldo: {
    type: Number,
    required: true,
    default: 0,
  },
  tipo: {
    type: String,
    enum: ['corrente', 'poupança', 'investimento'],
    required: true,
  },
  data: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

contaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Conta', contaSchema);
