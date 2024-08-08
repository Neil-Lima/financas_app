const Parcelamento = require('./parcelamentoModel');

const listarParcelamentos = async (usuarioId) => {
  return await Parcelamento.find({ usuario: usuarioId }).populate('categoria');
};

const criarParcelamento = async (usuarioId, parcelamentoData) => {
  return await Parcelamento.create({ ...parcelamentoData, usuario: usuarioId });
};

const atualizarParcelamento = async (id, parcelamentoData) => {
  const parcelamento = await Parcelamento.findByIdAndUpdate(id, parcelamentoData, { new: true });
  if (!parcelamento) {
    throw new Error('Parcelamento não encontrado');
  }
  return parcelamento;
};

const deletarParcelamento = async (id) => {
  const parcelamento = await Parcelamento.findByIdAndDelete(id);
  if (!parcelamento) {
    throw new Error('Parcelamento não encontrado');
  }
};

module.exports = { listarParcelamentos, criarParcelamento, atualizarParcelamento, deletarParcelamento };
