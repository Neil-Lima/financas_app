const mongoose = require('mongoose');

const alteracaoSchema = new mongoose.Schema({
  data: { type: Date, default: Date.now },
  campo: String,
  valorAntigo: mongoose.Schema.Types.Mixed,
  valorNovo: mongoose.Schema.Types.Mixed
});

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
  valor_restante: {
    type: Number,
    required: true,
    default: function() {
      return this.valor_planejado - this.valor_atual;
    }
  },
  mes: {
    type: Number,
    required: true,
  },
  ano: {
    type: Number,
    required: true,
  },
  notas: {
    type: String,
    default: ''
  },
  recorrencia: {
    type: String,
    enum: ['mensal', 'trimestral', 'anual', 'nao_recorrente'],
    default: 'nao_recorrente'
  },
  prioridade: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  historicoAlteracoes: [alteracaoSchema],
  metaEconomia: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Orcamento', orcamentoSchema);
