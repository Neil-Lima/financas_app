const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  valor_alvo: {
    type: Number,
    required: true,
  },
  valor_atual: {
    type: Number,
    required: true,
    default: 0,
  },
  data_limite: {
    type: Date,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
    enum: ['financeira', 'pessoal', 'profissional'],
  },
  recorrente: {
    type: Boolean,
    default: false,
  },
  periodo_recorrencia: {
    type: String,
    enum: ['diaria', 'semanal', 'mensal', 'anual'],
    required: function() { return this.recorrente; }
  },
  concluida: {
    type: Boolean,
    default: false,
  },
  historico_progresso: [{
    data: Date,
    valor: Number,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Meta', metaSchema);
