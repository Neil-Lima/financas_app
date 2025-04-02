import { useState, useEffect } from 'react';
import FinanciamentosServices from '../services/FinanciamentosServices';

/**
 * Hook personalizado com a lógica de negócio da página de Financiamentos
 * @returns {Object} Estados e funções para gerenciar financiamentos
 */
const useFinanciamentosLogic = () => {
  const [financiamentos, setFinanciamentos] = useState([]);
  const [newFinanciamento, setNewFinanciamento] = useState({
    descricao: '',
    valor_total: '',
    taxa_juros: '',
    parcelas_totais: '',
    data_inicio: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedFinanciamento, setEditedFinanciamento] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsFinanciamento, setDetailsFinanciamento] = useState(null);
  const [showParcelasModal, setShowParcelasModal] = useState(false);
  const [parcelasCalculadas, setParcelasCalculadas] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchFinanciamentos();
  }, []);

  /**
   * Busca a lista de financiamentos do servidor
   */
  const fetchFinanciamentos = async () => {
    try {
      const data = await FinanciamentosServices.fetchFinanciamentos();
      setFinanciamentos(data);
    } catch (error) {
      showAlert('Erro ao buscar financiamentos', 'danger');
    }
  };

  /**
   * Gerencia mudanças nos inputs do formulário de novo financiamento
   * @param {Object} event - Evento do input
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewFinanciamento({ ...newFinanciamento, [name]: value });
  };

  /**
   * Trata o envio do formulário de novo financiamento
   * @param {Object} event - Evento do formulário
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await FinanciamentosServices.addFinanciamento(newFinanciamento);
      setNewFinanciamento({
        descricao: '',
        valor_total: '',
        taxa_juros: '',
        parcelas_totais: '',
        data_inicio: ''
      });
      fetchFinanciamentos();
      showAlert('Financiamento adicionado com sucesso', 'success');
    } catch (error) {
      showAlert('Falha ao adicionar financiamento', 'danger');
    }
  };

  /**
   * Inicia o modo de edição para um financiamento
   * @param {Object} financiamento - Dados do financiamento a ser editado
   */
  const handleEdit = (financiamento) => {
    setEditingId(financiamento._id);
    setEditedFinanciamento({
      ...financiamento,
      data_inicio: financiamento.data_inicio ? new Date(financiamento.data_inicio).toISOString().split('T')[0] : ''
    });
  };

  /**
   * Gerencia mudanças nos inputs do formulário de edição
   * @param {Object} event - Evento do input
   */
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedFinanciamento({ ...editedFinanciamento, [name]: value });
  };

  /**
   * Salva as alterações feitas em um financiamento
   */
  const handleSaveEdit = async () => {
    try {
      await FinanciamentosServices.updateFinanciamento(editingId, editedFinanciamento);
      setEditingId(null);
      fetchFinanciamentos();
      showAlert('Financiamento atualizado com sucesso', 'success');
    } catch (error) {
      showAlert('Falha ao atualizar financiamento', 'danger');
    }
  };

  /**
   * Remove um financiamento
   * @param {string} id - ID do financiamento a ser removido
   */
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este financiamento?')) {
      try {
        await FinanciamentosServices.deleteFinanciamento(id);
        fetchFinanciamentos();
        showAlert('Financiamento excluído com sucesso', 'success');
      } catch (error) {
        showAlert('Falha ao excluir financiamento', 'danger');
      }
    }
  };

  /**
   * Exibe o modal de detalhes de um financiamento
   * @param {Object} financiamento - Dados do financiamento a serem exibidos
   */
  const handleShowDetails = (financiamento) => {
    setDetailsFinanciamento(financiamento);
    setShowDetailsModal(true);
  };

  /**
   * Fecha o modal de detalhes
   */
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };

  /**
   * Exibe o modal de parcelas de um financiamento
   * @param {Object} financiamento - Dados do financiamento para cálculo das parcelas
   */
  const handleShowParcelas = (financiamento) => {
    const parcelas = FinanciamentosServices.calcularParcelas(
      parseFloat(financiamento.valor_total),
      parseFloat(financiamento.taxa_juros),
      parseInt(financiamento.parcelas_totais)
    );
    setParcelasCalculadas(parcelas);
    setDetailsFinanciamento(financiamento);
    setShowParcelasModal(true);
  };

  /**
   * Fecha o modal de parcelas
   */
  const handleCloseParcelasModal = () => {
    setShowParcelasModal(false);
  };

  /**
   * Exibe um alerta na página
   * @param {string} message - Mensagem do alerta
   * @param {string} variant - Tipo de alerta (success, danger, warning, etc)
   */
  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  /**
   * Formata uma data para exibição local
   * @param {string} date - Data em formato string
   * @returns {string} Data formatada
   */
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  /**
   * Calcula o valor da parcela mensal
   * @param {Object} financiamento - Dados do financiamento
   * @returns {number} Valor da parcela
   */
  const calcularValorParcela = (financiamento) => {
    const valorTotal = parseFloat(financiamento.valor_total);
    const taxaJuros = parseFloat(financiamento.taxa_juros) / 100;
    const parcelas = parseInt(financiamento.parcelas_totais);
    
    // Fórmula de financiamento com juros compostos (Price)
    return (valorTotal * taxaJuros * Math.pow(1 + taxaJuros, parcelas)) / 
           (Math.pow(1 + taxaJuros, parcelas) - 1);
  };

  /**
   * Calcula o total a ser pago
   * @param {Object} financiamento - Dados do financiamento
   * @returns {number} Total a pagar
   */
  const calcularTotalPagar = (financiamento) => {
    const valorParcela = calcularValorParcela(financiamento);
    const parcelas = parseInt(financiamento.parcelas_totais);
    return valorParcela * parcelas;
  };

  /**
   * Calcula o total de juros
   * @param {Object} financiamento - Dados do financiamento
   * @returns {number} Total de juros
   */
  const calcularTotalJuros = (financiamento) => {
    const totalPagar = calcularTotalPagar(financiamento);
    const valorTotal = parseFloat(financiamento.valor_total);
    return totalPagar - valorTotal;
  };

  /**
   * Prepara os dados para exibição no gráfico
   * @returns {Object} Dados formatados para o gráfico
   */
  const getChartData = () => {
    return {
      labels: financiamentos.map(financiamento => financiamento.descricao),
      datasets: [
        {
          label: 'Valor Total',
          data: financiamentos.map(financiamento => financiamento.valor_total),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Total de Juros',
          data: financiamentos.map(financiamento => calcularTotalJuros(financiamento)),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ],
    };
  };

  /**
   * Configuração do gráfico
   */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Financiamentos: Principal vs Juros',
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      },
    },
  };

  return {
    financiamentos,
    newFinanciamento,
    editingId,
    editedFinanciamento,
    showDetailsModal,
    detailsFinanciamento,
    showParcelasModal,
    parcelasCalculadas,
    alert,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleCloseDetailsModal,
    handleShowParcelas,
    handleCloseParcelasModal,
    showAlert,
    formatDate,
    calcularValorParcela,
    calcularTotalPagar,
    calcularTotalJuros,
    getChartData,
    chartOptions,
    setEditingId,
    setAlert
  };
};

export const FinanciamentosUtils = {
  useFinanciamentosLogic
}; 