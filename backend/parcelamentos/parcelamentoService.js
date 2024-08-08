const Parcelamento = require('./parcelamentoModel');

const listarParcelamentos = async (usuarioId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Parcelamento.find({ usuario: usuarioId })
    .populate('categoria')
    .sort({ dataInicio: -1 })
    .skip(skip)
    .limit(limit);
};

const criarParcelamento = async (usuarioId, parcelamentoData) => {
  return await Parcelamento.create({ ...parcelamentoData, usuario: usuarioId });
};

const atualizarParcelamento = async (id, parcelamentoData, usuarioId) => {
  const parcelamento = await Parcelamento.findOneAndUpdate(
    { _id: id, usuario: usuarioId },
    parcelamentoData,
    { new: true, runValidators: true }
  );
  if (!parcelamento) {
    throw new Error('Parcelamento não encontrado');
  }
  return parcelamento;
};

const deletarParcelamento = async (id, usuarioId) => {
  const parcelamento = await Parcelamento.findOneAndDelete({ _id: id, usuario: usuarioId });
  if (!parcelamento) {
    throw new Error('Parcelamento não encontrado');
  }
};

module.exports = { listarParcelamentos, criarParcelamento, atualizarParcelamento, deletarParcelamento };
