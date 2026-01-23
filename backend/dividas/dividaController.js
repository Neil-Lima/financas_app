const dividaService = require('./dividaService');

const getResumoDividas = async (req, res) => {
  try {
    const resumo = await dividaService.getResumoDividas(req.user.id);
    res.json(resumo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResumoDividas };
