const Parcelamento = require('../parcelamentos/parcelamentoModel');
const Financiamento = require('../financiamentos/financiamentoModel');
const vencimentoService = require('../vencimentos/vencimentoService');

const getResumoDividas = async (usuarioId) => {
  const parcelamentos = await Parcelamento.find({ usuario: usuarioId }).select('valorTotal').lean();
  const financiamentos = await Financiamento.find({ usuario: usuarioId }).select('valor_total').lean();

  const totalParcelamentos = parcelamentos.reduce((acc, p) => acc + Number(p.valorTotal || 0), 0);
  const totalFinanciamentos = financiamentos.reduce((acc, f) => acc + Number(f.valor_total || 0), 0);

  const now = new Date();
  const in30 = new Date(now);
  in30.setDate(in30.getDate() + 30);

  const proximosVencimentos = await vencimentoService.listarVencimentos(usuarioId, {
    dataInicio: now.toISOString(),
    dataFim: in30.toISOString(),
  });

  return {
    total_dividas: totalParcelamentos + totalFinanciamentos,
    total_parcelamentos: parcelamentos.length,
    total_financiamentos: financiamentos.length,
    proximos_vencimentos: proximosVencimentos.slice(0, 10),
  };
};

module.exports = { getResumoDividas };
