const Despesa = require('./despesaModel');

const listarDespesas = async (usuarioId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Despesa.find({ usuario: usuarioId })
    .populate('categoria')
    .sort({ data: -1 })
    .skip(skip)
    .limit(limit);
};

const criarDespesa = async (usuarioId, despesaData) => {
  return await Despesa.create({ ...despesaData, usuario: usuarioId });
};

const atualizarDespesa = async (id, despesaData, usuarioId) => {
  const despesa = await Despesa.findOneAndUpdate(
    { _id: id, usuario: usuarioId },
    despesaData,
    { new: true, runValidators: true }
  ).populate('categoria');
  if (!despesa) {
    throw new Error('Despesa não encontrada');
  }
  return despesa;
};

const deletarDespesa = async (id, usuarioId) => {
  const despesa = await Despesa.findOneAndDelete({ _id: id, usuario: usuarioId });
  if (!despesa) {
    throw new Error('Despesa não encontrada');
  }
};

module.exports = { listarDespesas, criarDespesa, atualizarDespesa, deletarDespesa };
