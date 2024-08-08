const transacaoService = require('./transacaoService');

const listarTransacoes = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const transacoes = await transacaoService.listarTransacoes(req.user.id, page, limit);
    res.json(transacoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const criarTransacao = async (req, res) => {
  try {
    const transacao = await transacaoService.criarTransacao(req.user.id, req.body);
    res.status(201).json(transacao);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const atualizarTransacao = async (req, res) => {
  try {
    const transacao = await transacaoService.atualizarTransacao(req.params.id, req.body, req.user.id);
    res.json(transacao);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletarTransacao = async (req, res) => {
  try {
    await transacaoService.deletarTransacao(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { listarTransacoes, criarTransacao, atualizarTransacao, deletarTransacao };
