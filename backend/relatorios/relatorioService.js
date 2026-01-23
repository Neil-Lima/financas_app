const PDFDocument = require('pdfkit');
const Transacao = require('../transacoes/transacaoModel');
const Meta = require('../metas/metaModel');
const Orcamento = require('../orcamentos/orcamentoModel');

function toDateOrThrow(value, label) {
  const d = new Date(value);
  if (!value || Number.isNaN(d.getTime())) {
    throw new Error(`${label} inválida`);
  }
  return d;
}

function monthLabel(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

const getRelatorioCompleto = async (usuarioId, dataInicio, dataFim) => {
  const start = toDateOrThrow(dataInicio, 'Data Inicial');
  const end = toDateOrThrow(dataFim, 'Data Final');

  const transacoes = await Transacao.find({
    usuario: usuarioId,
    data: { $gte: start, $lte: end },
  }).populate('categoria').lean();

  const receita_total = transacoes
    .filter((t) => t.tipo === 'receita')
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);
  const despesa_total = transacoes
    .filter((t) => t.tipo === 'despesa')
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);
  const saldo_total = receita_total - despesa_total;

  const byCategoria = new Map();
  for (const t of transacoes) {
    const nome = t?.categoria?.nome || 'Sem categoria';
    byCategoria.set(nome, (byCategoria.get(nome) || 0) + Number(t.valor || 0));
  }
  const transacoesPorCategoria = Array.from(byCategoria.entries()).map(([categoria, total]) => ({ categoria, total }));
  transacoesPorCategoria.sort((a, b) => b.total - a.total);

  const byMes = new Map();
  for (const t of transacoes) {
    const label = monthLabel(new Date(t.data));
    const cur = byMes.get(label) || { mes: label, receitas: 0, despesas: 0 };
    if (t.tipo === 'receita') cur.receitas += Number(t.valor || 0);
    else cur.despesas += Number(t.valor || 0);
    byMes.set(label, cur);
  }
  const fluxoCaixa = Array.from(byMes.values()).sort((a, b) => a.mes.localeCompare(b.mes));

  const metas = await Meta.find({ usuario: usuarioId }).select('descricao valor_atual valor_alvo').lean();
  const progressoMetas = metas.map((m) => ({
    descricao: m.descricao,
    valor_atual: Number(m.valor_atual || 0),
    valor_alvo: Number(m.valor_alvo || 0),
  }));

  const orcamentos = await Orcamento.find({ usuario: usuarioId }).populate('categoria').lean();
  const desempenhoOrcamentos = orcamentos.map((o) => ({
    categoria: o?.categoria?.nome || 'Sem categoria',
    valor_planejado: Number(o.valor_planejado || 0),
    valor_atual: Number(o.valor_atual || 0),
  }));

  return {
    resumoFinanceiro: { receita_total, despesa_total, saldo_total },
    transacoesPorCategoria,
    fluxoCaixa,
    progressoMetas,
    desempenhoOrcamentos,
  };
};

const gerarPDFRelatorio = async (usuarioId, dataInicio, dataFim) => {
  const relatorio = await getRelatorioCompleto(usuarioId, dataInicio, dataFim);

  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));

  doc.fontSize(18).text('Relatório Financeiro', { align: 'center' });
  doc.moveDown();

  const r = relatorio.resumoFinanceiro;
  doc.fontSize(12).text(`Receita Total: R$ ${Number(r.receita_total || 0).toFixed(2)}`);
  doc.text(`Despesa Total: R$ ${Number(r.despesa_total || 0).toFixed(2)}`);
  doc.text(`Saldo Total: R$ ${Number(r.saldo_total || 0).toFixed(2)}`);

  doc.moveDown();
  doc.fontSize(14).text('Transações por Categoria');
  doc.moveDown(0.5);

  relatorio.transacoesPorCategoria.slice(0, 10).forEach((item) => {
    doc.fontSize(11).text(`${item.categoria}: R$ ${Number(item.total || 0).toFixed(2)}`);
  });

  doc.moveDown();
  doc.fontSize(14).text('Progresso das Metas');
  doc.moveDown(0.5);
  relatorio.progressoMetas.slice(0, 10).forEach((m) => {
    doc.fontSize(11).text(`${m.descricao}: R$ ${Number(m.valor_atual || 0).toFixed(2)} / R$ ${Number(m.valor_alvo || 0).toFixed(2)}`);
  });

  doc.end();

  return await new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
};

module.exports = { getRelatorioCompleto, gerarPDFRelatorio };
