import { useState, useEffect } from 'react';
import DespesasServices from '../services/DespesasServices';

/**
 * Hook personalizado com a lógica de negócio da página de Despesas
 * @returns {Object} Estados e funções para gerenciar despesas
 */
const useDespesasLogic = () => {
  const [despesas, setDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newDespesa, setNewDespesa] = useState({
    descricao: '',
    valor: '',
    data: '',
    categoria: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedDespesa, setEditedDespesa] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsDespesa, setDetailsDespesa] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchDespesas();
    fetchCategorias();
  }, []);

  /**
   * Busca a lista de despesas do servidor
   */
  const fetchDespesas = async () => {
    try {
      const data = await DespesasServices.fetchDespesas();
      setDespesas(data);
    } catch (error) {
      showAlert('Erro ao buscar despesas', 'danger');
    }
  };

  /**
   * Busca a lista de categorias do servidor
   */
  const fetchCategorias = async () => {
    try {
      const data = await DespesasServices.fetchCategorias();
      setCategorias(data);
    } catch (error) {
      showAlert('Erro ao buscar categorias', 'danger');
    }
  };

  /**
   * Gerencia mudanças nos inputs do formulário de nova despesa
   * @param {Object} event - Evento do input
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDespesa({ ...newDespesa, [name]: value });
  };

  /**
   * Trata o envio do formulário de nova despesa
   * @param {Object} event - Evento do formulário
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await DespesasServices.addDespesa(newDespesa);
      setNewDespesa({ descricao: '', valor: '', data: '', categoria: '' });
      fetchDespesas();
      showAlert('Despesa adicionada com sucesso', 'success');
    } catch (error) {
      showAlert('Falha ao adicionar despesa', 'danger');
    }
  };

  /**
   * Inicia o modo de edição para uma despesa
   * @param {Object} despesa - Dados da despesa a ser editada
   */
  const handleEdit = (despesa) => {
    setEditingId(despesa._id);
    setEditedDespesa(despesa);
  };

  /**
   * Gerencia mudanças nos inputs do formulário de edição
   * @param {Object} event - Evento do input
   */
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedDespesa({ ...editedDespesa, [name]: value });
  };

  /**
   * Salva as alterações feitas em uma despesa
   */
  const handleSaveEdit = async () => {
    try {
      await DespesasServices.updateDespesa(editingId, editedDespesa);
      setEditingId(null);
      fetchDespesas();
      showAlert('Despesa atualizada com sucesso', 'success');
    } catch (error) {
      showAlert('Falha ao atualizar despesa', 'danger');
    }
  };

  /**
   * Remove uma despesa
   * @param {string} id - ID da despesa a ser removida
   */
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await DespesasServices.deleteDespesa(id);
        fetchDespesas();
        showAlert('Despesa excluída com sucesso', 'success');
      } catch (error) {
        showAlert('Falha ao excluir despesa', 'danger');
      }
    }
  };

  /**
   * Exibe o modal de detalhes de uma despesa
   * @param {Object} despesa - Dados da despesa a serem exibidos
   */
  const handleShowDetails = (despesa) => {
    setDetailsDespesa(despesa);
    setShowDetailsModal(true);
  };

  /**
   * Fecha o modal de detalhes
   */
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
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
   * Prepara os dados para exibição no gráfico
   * @returns {Object} Dados formatados para o gráfico
   */
  const getChartData = () => {
    return {
      labels: categorias.map(categoria => categoria.nome),
      datasets: [
        {
          label: 'Total de Despesas por Categoria',
          data: categorias.map(categoria => 
            despesas.filter(despesa => despesa.categoria && despesa.categoria._id === categoria._id)
              .reduce((acc, curr) => acc + curr.valor, 0)
          ),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
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
        text: 'Despesas por Categoria',
      },
    },
  };

  return {
    despesas,
    categorias,
    newDespesa,
    editingId,
    editedDespesa,
    showDetailsModal,
    detailsDespesa,
    alert,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleCloseDetailsModal,
    showAlert,
    getChartData,
    chartOptions,
    setEditingId,
    setAlert
  };
};

export const DespesasUtils = {
  useDespesasLogic
}; 