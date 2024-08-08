const mongoose = require('mongoose');

const parcelamentoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  valorTotal: {
    type: Number,
    required: true,
  },
  numeroParcelas: {
    type: Number,
    required: true,
  },
  dataInicio: {
    type: Date,
    required: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Parcelamento', parcelamentoSchema);
