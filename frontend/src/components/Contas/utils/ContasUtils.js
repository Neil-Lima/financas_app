import { useState, useEffect } from 'react';
import ContasServices from '../services/ContasServices';

/**
 * Hook personalizado com a lógica de negócio da página de Contas
 * @returns {Object} Estados e funções para gerenciar contas
 */
const useContasLogic = () => {
  const [contas, setContas] = useState([]);
  const [newConta, setNewConta] = useState({ nome: '', saldo: '', tipo: '', data: '' });
  const [editingId, setEditingId] = useState(null);
  const [editedConta, setEditedConta] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsConta, setDetailsConta] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchContas();
  }, []);

  /**
   * Busca a lista de contas do servidor
   */
  const fetchContas = async () => {
    try {
      const data = await ContasServices.fetchContas();
      setContas(data);
    } catch (error) {
      showAlert('Erro ao buscar contas', 'danger');
    }
  };

  /**
   * Gerencia mudanças nos inputs do formulário de nova conta
   * @param {Object} e - Evento do input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConta({ ...newConta, [name]: value });
  };

  /**
   * Trata o envio do formulário de nova conta
   * @param {Object} e - Evento do formulário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ContasServices.addConta(newConta);
      setNewConta({ nome: '', saldo: '', tipo: '', data: '' });
      fetchContas();
      showAlert('Conta adicionada com sucesso', 'success');
    } catch (error) {
      showAlert('Falha ao adicionar conta', 'danger');
    }
  };

  /**
   * Inicia o modo de edição para uma conta
   * @param {Object} conta - Dados da conta a ser editada
   */
  const handleEdit = (conta) => {
    setEditingId(conta._id);
    setEditedConta({...conta, data: new Date(conta.data).toISOString().split('T')[0]});
  };

  /**
   * Gerencia mudanças nos inputs do formulário de edição
   * @param {Object} e - Evento do input
   */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedConta({ ...editedConta, [name]: value });
  };

  /**
   * Salva as alterações feitas em uma conta
   */
  const handleSaveEdit = async () => {
    try {
      await ContasServices.updateConta(editingId, editedConta);
      setEditingId(null);
      fetchContas();
      showAlert('Conta atualizada com sucesso', 'success');
    } catch (error) {
      showAlert('Falha ao atualizar conta', 'danger');
    }
  };

  /**
   * Remove uma conta
   * @param {string} id - ID da conta a ser removida
   */
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        await ContasServices.deleteConta(id);
        fetchContas();
        showAlert('Conta excluída com sucesso', 'success');
      } catch (error) {
        showAlert('Falha ao excluir conta', 'danger');
      }
    }
  };

  /**
   * Exibe o modal de detalhes de uma conta
   * @param {Object} conta - Dados da conta a serem exibidos
   */
  const handleShowDetails = (conta) => {
    setDetailsConta(conta);
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
   * Formata uma data para o formato local
   * @param {string} dateString - Data em formato string
   * @returns {string} Data formatada
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return {
    contas,
    newConta,
    editingId,
    editedConta,
    showDetailsModal,
    detailsConta,
    alert,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleCloseDetailsModal,
    formatDate,
    setEditingId,
    setAlert
  };
};

export const ContasUtils = {
  useContasLogic
}; 