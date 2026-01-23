import { useCallback, useState } from 'react';
import { relatoriosServices } from '../services/RelatoriosServices';

export function useRelatoriosUtils() {
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [relatorio, setRelatorio] = useState(null);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'dataInicial') setDataInicial(value);
    if (name === 'dataFinal') setDataFinal(value);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const data = await relatoriosServices.getRelatorioCompleto(dataInicial, dataFinal);
      setRelatorio(data);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  }, [dataInicial, dataFinal]);

  const handleDownloadPDF = useCallback(async () => {
    try {
      const response = await relatoriosServices.downloadPDF(dataInicial, dataFinal);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio_financeiro.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    }
  }, [dataInicial, dataFinal]);

  return {
    dataInicial,
    dataFinal,
    relatorio,
    handleInputChange,
    handleSubmit,
    handleDownloadPDF,
  };
}
