import { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import RelatoriosServices from '../services/RelatoriosServices';

/**
 * Hook para gerenciamento de relatórios
 */
export const useRelatorios = () => {
  // Estados
  const [transacoes, setTransacoes] = useState([]);
  const [relatorioData, setRelatorioData] = useState(null);
  const [tipoRelatorio, setTipoRelatorio] = useState('resumo');
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    tipo: 'todas',
    categoria: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [showModal, setShowModal] = useState(false);

  /**
   * Carrega categorias para os filtros
   */
  const fetchCategorias = useCallback(async () => {
    try {
      const response = await RelatoriosServices.fetchCategorias();
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setError('Erro ao carregar categorias. Por favor, tente novamente.');
    }
  }, []);

  /**
   * Carrega as transações com base nos filtros
   */
  const fetchTransacoes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await RelatoriosServices.fetchTransacoes(filtros);
      setTransacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      setError('Erro ao buscar transações. Por favor, tente novamente.');
      showAlert('Erro ao buscar transações', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [filtros]);

  /**
   * Gera relatório com base no tipo selecionado
   */
  const gerarRelatorio = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (tipoRelatorio) {
        case 'resumo':
          response = await RelatoriosServices.gerarRelatorioResumo(filtros);
          break;
        case 'fluxo-caixa':
          response = await RelatoriosServices.gerarRelatorioFluxoCaixa(filtros);
          break;
        case 'despesas-categoria':
          response = await RelatoriosServices.gerarRelatorioDespesasPorCategoria(filtros);
          break;
        case 'evolucao-patrimonial':
          response = await RelatoriosServices.gerarRelatorioEvolucaoPatrimonial(filtros);
          break;
        default:
          response = await RelatoriosServices.gerarRelatorioResumo(filtros);
      }
      
      setRelatorioData(response.data);
      setShowModal(true);
      showAlert('Relatório gerado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setError('Erro ao gerar relatório. Por favor, tente novamente.');
      showAlert('Erro ao gerar relatório', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [filtros, tipoRelatorio]);

  /**
   * Exporta relatório para PDF
   */
  const exportarPDF = useCallback(async () => {
    if (!relatorioData) {
      showAlert('Gere um relatório antes de exportar', 'warning');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await RelatoriosServices.exportarPDF(relatorioData, tipoRelatorio);
      
      // Simula download do arquivo
      const url = response.data.fileUrl;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-${tipoRelatorio}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showAlert('Relatório exportado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao exportar relatório para PDF:', error);
      showAlert('Erro ao exportar relatório', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [relatorioData, tipoRelatorio]);

  /**
   * Exporta relatório para Excel
   */
  const exportarExcel = useCallback(async () => {
    if (!relatorioData) {
      showAlert('Gere um relatório antes de exportar', 'warning');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await RelatoriosServices.exportarExcel(relatorioData, tipoRelatorio);
      
      // Simula download do arquivo
      const url = response.data.fileUrl;
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-${tipoRelatorio}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showAlert('Relatório exportado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao exportar relatório para Excel:', error);
      showAlert('Erro ao exportar relatório', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [relatorioData, tipoRelatorio]);

  /**
   * Atualiza os filtros
   */
  const handleFilterChange = useCallback((name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Define período atual (mês atual)
   */
  const setPeriodoAtual = useCallback(() => {
    setFiltros(prev => ({
      ...prev,
      startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    }));
  }, []);

  /**
   * Define período anterior (mês anterior)
   */
  const setPeriodoAnterior = useCallback(() => {
    const dataAnterior = subMonths(new Date(), 1);
    setFiltros(prev => ({
      ...prev,
      startDate: format(startOfMonth(dataAnterior), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(dataAnterior), 'yyyy-MM-dd')
    }));
  }, []);

  /**
   * Mostra mensagem de alerta
   */
  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: '', variant: 'success' });
    }, 3000);
  }, []);

  /**
   * Formata valor monetário para exibição
   */
  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  /**
   * Formata data para exibição
   */
  const formatDate = useCallback((dateString) => {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
  }, []);

  /**
   * Calcula totais para o relatório de resumo
   */
  const calcularTotais = useCallback(() => {
    if (!transacoes || transacoes.length === 0) {
      return { totalReceitas: 0, totalDespesas: 0, saldo: 0 };
    }
    
    const totalReceitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((total, t) => total + t.valor, 0);
      
    const totalDespesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((total, t) => total + t.valor, 0);
      
    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas
    };
  }, [transacoes]);

  /**
   * Prepara dados para o gráfico de despesas por categoria
   */
  const prepararDadosGraficoCategorias = useCallback(() => {
    if (!transacoes || transacoes.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    // Agrupar despesas por categoria
    const despesasPorCategoria = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, transaction) => {
        const categoria = transaction.categoria || 'Sem categoria';
        if (!acc[categoria]) {
          acc[categoria] = 0;
        }
        acc[categoria] += transaction.valor;
        return acc;
      }, {});
    
    // Gerar cores para o gráfico
    const generateRandomColors = (count) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = Math.floor(Math.random() * 360);
        colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
      }
      return colors;
    };
    
    const labels = Object.keys(despesasPorCategoria);
    const data = Object.values(despesasPorCategoria);
    const backgroundColor = generateRandomColors(labels.length);
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 1
        }
      ]
    };
  }, [transacoes]);

  /**
   * Prepara dados para o gráfico de evolução mensal
   */
  const prepararDadosGraficoEvolucao = useCallback(() => {
    if (!relatorioData || !relatorioData.evolucaoMensal) {
      return { labels: [], datasets: [] };
    }
    
    const { evolucaoMensal } = relatorioData;
    
    return {
      labels: evolucaoMensal.map(item => item.mes),
      datasets: [
        {
          label: 'Receitas',
          data: evolucaoMensal.map(item => item.receitas),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Despesas',
          data: evolucaoMensal.map(item => item.despesas),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Saldo',
          data: evolucaoMensal.map(item => item.saldo),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  }, [relatorioData]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  // Efeito para atualizar transações quando os filtros mudam
  useEffect(() => {
    fetchTransacoes();
  }, [fetchTransacoes, filtros]);

  return {
    transacoes,
    relatorioData,
    tipoRelatorio,
    categorias,
    filtros,
    isLoading,
    error,
    alert,
    showModal,
    setShowModal,
    setTipoRelatorio,
    handleFilterChange,
    setPeriodoAtual,
    setPeriodoAnterior,
    gerarRelatorio,
    exportarPDF,
    exportarExcel,
    formatCurrency,
    formatDate,
    calcularTotais,
    prepararDadosGraficoCategorias,
    prepararDadosGraficoEvolucao,
    showAlert
  };
};

export const RelatoriosUtils = {
  useRelatorios
}; 