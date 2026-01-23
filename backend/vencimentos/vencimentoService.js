const ContaAPagar = require('../contasAPagar/contaAPagarModel');
const Parcelamento = require('../parcelamentos/parcelamentoModel');
const Financiamento = require('../financiamentos/financiamentoModel');

function toDateOrNull(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

const listarVencimentos = async (usuarioId, { dataInicio, dataFim, tipo } = {}) => {
  const start = toDateOrNull(dataInicio);
  const end = toDateOrNull(dataFim);

  const inRange = (field) => {
    if (!start && !end) return {};
    const q = {};
    if (start) q.$gte = start;
    if (end) q.$lte = end;
    return { [field]: q };
  };

  const items = [];

  if (!tipo || tipo === 'conta-a-pagar') {
    const contas = await ContaAPagar.find({ usuario: usuarioId, ...inRange('vencimento') })
      .select('descricao valor vencimento status')
      .lean();
    for (const c of contas) {
      items.push({
        _id: c._id,
        tipo: 'conta-a-pagar',
        descricao: c.descricao,
        valor: c.valor,
        vencimento: c.vencimento,
        status: c.status,
      });
    }
  }

  if (!tipo || tipo === 'parcela') {
    const parcelamentos = await Parcelamento.find({ usuario: usuarioId }).select('descricao valorTotal numeroParcelas dataInicio').lean();
    for (const p of parcelamentos) {
      const total = Number(p.valorTotal || 0);
      const n = Math.max(1, Number(p.numeroParcelas || 1));
      const valorParcela = total / n;
      const base = new Date(p.dataInicio);
      for (let i = 0; i < n; i++) {
        const venc = new Date(base);
        venc.setMonth(venc.getMonth() + i);
        if (start && venc < start) continue;
        if (end && venc > end) continue;
        items.push({
          _id: `${p._id}-parcela-${i + 1}`,
          tipo: 'parcela',
          descricao: `${p.descricao} (${i + 1}/${n})`,
          valor: Number.isFinite(valorParcela) ? valorParcela : 0,
          vencimento: venc,
        });
      }
    }
  }

  if (!tipo || tipo === 'financiamento') {
    const financiamentos = await Financiamento.find({ usuario: usuarioId }).select('descricao valor_total parcelas_totais data_inicio').lean();
    for (const f of financiamentos) {
      const total = Number(f.valor_total || 0);
      const n = Math.max(1, Number(f.parcelas_totais || 1));
      const valorParcela = total / n;
      const base = new Date(f.data_inicio);
      for (let i = 0; i < n; i++) {
        const venc = new Date(base);
        venc.setMonth(venc.getMonth() + i);
        if (start && venc < start) continue;
        if (end && venc > end) continue;
        items.push({
          _id: `${f._id}-fin-${i + 1}`,
          tipo: 'financiamento',
          descricao: `${f.descricao} (${i + 1}/${n})`,
          valor: Number.isFinite(valorParcela) ? valorParcela : 0,
          vencimento: venc,
        });
      }
    }
  }

  items.sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime());
  return items;
};

module.exports = { listarVencimentos };
