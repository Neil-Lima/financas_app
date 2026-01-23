const relatorioService = require('./relatorioService');

const getRelatorioCompleto = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const data = await relatorioService.getRelatorioCompleto(req.user.id, dataInicio, dataFim);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const downloadPDF = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const pdfBuffer = await relatorioService.gerarPDFRelatorio(req.user.id, dataInicio, dataFim);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio_financeiro.pdf"');
    res.status(200).send(pdfBuffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getRelatorioCompleto, downloadPDF };
