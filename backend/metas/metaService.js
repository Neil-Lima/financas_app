const Meta = require('./metaModel');

const listarMetas = async (usuarioId) => {
  return await Meta.find({ usuario: usuarioId });
};

const criarMeta = async (usuarioId, metaData) => {
  if (metaData.recorrente && !metaData.periodo_recorrencia) {
    throw new Error('Período de recorrência é obrigatório para metas recorrentes');
  }
  const novaMeta = new Meta({ ...metaData, usuario: usuarioId });
  await novaMeta.save();
  await atualizarHistoricoProgresso(novaMeta._id, metaData.valor_atual);
  return novaMeta;
};

const atualizarMeta = async (id, metaData) => {
  const meta = await Meta.findByIdAndUpdate(id, metaData, { new: true, runValidators: true });
  if (!meta) {
    throw new Error('Meta não encontrada');
  }
  await atualizarHistoricoProgresso(id, metaData.valor_atual);
  return meta;
};

const deletarMeta = async (id) => {
  const meta = await Meta.findByIdAndDelete(id);
  if (!meta) {
    throw new Error('Meta não encontrada');
  }
};

const atualizarHistoricoProgresso = async (metaId, valorAtual) => {
  await Meta.findByIdAndUpdate(metaId, {
    $push: {
      historico_progresso: {
        data: new Date(),
        valor: valorAtual,
      },
    },
  });
};

const obterEstatisticas = async (usuarioId) => {
  const metas = await Meta.find({ usuario: usuarioId });
  const totalMetas = metas.length;
  const metasConcluidas = metas.filter(meta => meta.concluida).length;
  const taxaConclusao = totalMetas > 0 ? (metasConcluidas / totalMetas) * 100 : 0;

  return {
    totalMetas,
    metasConcluidas,
    taxaConclusao,
  };
};

module.exports = { 
  listarMetas, 
  criarMeta, 
  atualizarMeta, 
  deletarMeta,
  obterEstatisticas,
};
