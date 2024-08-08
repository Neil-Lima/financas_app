const metaService = require('./metaService');

const listarMetas = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const metas = await metaService.listarMetas(req.user.id, page, limit);
    res.json(metas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarMeta = async (req, res) => {
  try {
    const meta = await metaService.criarMeta(req.user.id, req.body);
    res.status(201).json(meta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarMeta = async (req, res) => {
  try {
    const meta = await metaService.atualizarMeta(req.params.id, req.body, req.user.id);
    res.json(meta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarMeta = async (req, res) => {
  try {
    await metaService.deletarMeta(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const obterEstatisticas = async (req, res) => {
  try {
    const estatisticas = await metaService.obterEstatisticas(req.user.id);
    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listarMetas, criarMeta, atualizarMeta, deletarMeta, obterEstatisticas };
