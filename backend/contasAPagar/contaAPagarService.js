const ContaAPagar = require('./contaAPagarModel');

const listarContasAPagar = async (usuarioId) => {
  return await ContaAPagar.find({ usuario: usuarioId }).sort({ vencimento: 1 });
};

const criarContaAPagar = async (usuarioId, data) => {
  return await ContaAPagar.create({ ...data, usuario: usuarioId });
};

const atualizarContaAPagar = async (id, data) => {
  const conta = await ContaAPagar.findByIdAndUpdate(id, data, { new: true });
  if (!conta) throw new Error('Conta a pagar não encontrada');
  return conta;
};

const deletarContaAPagar = async (id) => {
  const conta = await ContaAPagar.findByIdAndDelete(id);
  if (!conta) throw new Error('Conta a pagar não encontrada');
};

module.exports = {
  listarContasAPagar,
  criarContaAPagar,
  atualizarContaAPagar,
  deletarContaAPagar,
};
