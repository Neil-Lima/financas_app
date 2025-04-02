import { useState, useEffect } from 'react';
import EstoqueServices from '../services/EstoqueServices';

/**
 * Hook personalizado com a lógica de negócio da página de Estoque
 * @returns {Object} Estados e funções para gerenciar estoque
 */
const useEstoqueLogic = () => {
  const [estoqueItems, setEstoqueItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newItem, setNewItem] = useState({
    nome_produto: '',
    quantidade: '',
    preco_unitario: '',
    categoria: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    fetchEstoque();
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredItems(estoqueItems);
    } else {
      setFilteredItems(
        estoqueItems.filter(item =>
          item.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.categoria && item.categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [searchTerm, estoqueItems]);

  /**
   * Busca a lista de itens do estoque do servidor
   */
  const fetchEstoque = async () => {
    try {
      const data = await EstoqueServices.fetchEstoque();
      setEstoqueItems(data);
      setFilteredItems(data);
    } catch (error) {
      showAlert('Erro ao buscar itens do estoque', 'danger');
    }
  };

  /**
   * Busca a lista de categorias do servidor
   */
  const fetchCategorias = async () => {
    try {
      const data = await EstoqueServices.fetchCategorias();
      setCategorias(data);
    } catch (error) {
      showAlert('Erro ao buscar categorias', 'danger');
    }
  };

  /**
   * Gerencia mudanças nos inputs do formulário de novo item
   * @param {Object} event - Evento do input
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  /**
   * Trata o envio do formulário de novo item
   * @param {Object} event - Evento do formulário
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await EstoqueServices.addItem(newItem);
      setNewItem({ nome_produto: '', quantidade: '', preco_unitario: '', categoria: '' });
      fetchEstoque();
      showAlert('Item adicionado com sucesso', 'success');
    } catch (error) {
      showAlert('Falha ao adicionar item', 'danger');
    }
  };

  /**
   * Inicia o modo de edição para um item
   * @param {Object} item - Dados do item a ser editado
   */
  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditedItem({
      ...item,
      categoria: item.categoria && item.categoria._id ? item.categoria._id : item.categoria
    });
  };

  /**
   * Gerencia mudanças nos inputs do formulário de edição
   * @param {Object} event - Evento do input
   */
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedItem({ ...editedItem, [name]: value });
  };

  /**
   * Salva as alterações feitas em um item
   */
  const handleSaveEdit = async () => {
    try {
      await EstoqueServices.updateItem(editingId, editedItem);
      setEditingId(null);
      fetchEstoque();
      showAlert('Item atualizado com sucesso', 'success');
    } catch (error) {
      showAlert('Falha ao atualizar item', 'danger');
    }
  };

  /**
   * Remove um item
   * @param {string} id - ID do item a ser removido
   */
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await EstoqueServices.deleteItem(id);
        fetchEstoque();
        showAlert('Item excluído com sucesso', 'success');
      } catch (error) {
        showAlert('Falha ao excluir item', 'danger');
      }
    }
  };

  /**
   * Exibe o modal de detalhes de um item
   * @param {Object} item - Dados do item a serem exibidos
   */
  const handleShowDetails = (item) => {
    setDetailsItem(item);
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
   * Atualiza o termo de busca
   * @param {Object} event - Evento do input de busca
   */
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Calcula o valor total de um item
   * @param {Object} item - Item do estoque
   * @returns {number} Valor total do item
   */
  const calcularValorTotal = (item) => {
    return parseFloat(item.quantidade) * parseFloat(item.preco_unitario);
  };

  /**
   * Calcula o valor total do estoque
   * @returns {number} Valor total do estoque
   */
  const calcularValorTotalEstoque = () => {
    return estoqueItems.reduce((total, item) => total + calcularValorTotal(item), 0);
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
          label: 'Valor Total por Categoria',
          data: categorias.map(categoria => 
            estoqueItems
              .filter(item => item.categoria && item.categoria._id === categoria._id)
              .reduce((acc, item) => acc + calcularValorTotal(item), 0)
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
        text: 'Valor Total por Categoria',
      },
    },
  };

  return {
    estoqueItems,
    filteredItems,
    categorias,
    newItem,
    editingId,
    editedItem,
    showDetailsModal,
    detailsItem,
    alert,
    searchTerm,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleCloseDetailsModal,
    showAlert,
    handleSearch,
    calcularValorTotal,
    calcularValorTotalEstoque,
    getChartData,
    chartOptions,
    setEditingId,
    setAlert
  };
};

export const EstoqueUtils = {
  useEstoqueLogic
}; 