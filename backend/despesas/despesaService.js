const Despesa = require('./despesaModel');

const listarDespesas = async (usuarioId) => {
  return await Despesa.find({ usuario: usuarioId }).populate('categoria');
};

const criarDespesa = async (usuarioId, despesaData) => {
  return await Despesa.create({ ...despesaData, usuario: usuarioId });
};

const atualizarDespesa = async (id, despesaData) => {
  const despesa = await Despesa.findByIdAndUpdate(id, despesaData, { new: true });
  if (!despesa) {
    throw new Error('Despesa não encontrada');
  }
  return despesa;
};

const deletarDespesa = async (id) => {
  const despesa = await Despesa.findByIdAndDelete(id);
  if (!despesa) {
    throw new Error('Despesa não encontrada');
  }
};

module.exports = { listarDespesas, criarDespesa, atualizarDespesa, deletarDespesa };
