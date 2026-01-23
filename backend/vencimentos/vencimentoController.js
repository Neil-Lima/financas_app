const vencimentoService = require('./vencimentoService');

const listarVencimentos = async (req, res) => {
  try {
    const itens = await vencimentoService.listarVencimentos(req.user.id, {
      dataInicio: req.query.dataInicio,
      dataFim: req.query.dataFim,
      tipo: req.query.tipo,
    });
    res.json(itens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listarVencimentos };
