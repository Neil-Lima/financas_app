import { useCallback, useEffect, useState } from 'react';
import { contasServices } from '../services/ContasServices';

export function useContasUtils() {
  const [contas, setContas] = useState([]);
  const [newConta, setNewConta] = useState({ nome: '', saldo: '', tipo: '', data: '' });
  const [editingId, setEditingId] = useState(null);
  const [editedConta, setEditedConta] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsConta, setDetailsConta] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchContas = useCallback(async () => {
    try {
      const data = await contasServices.getContas();
      setContas(data);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      showAlert('Erro ao buscar contas', 'danger');
    }
  }, [showAlert]);

  useEffect(() => {
    fetchContas();
  }, [fetchContas]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewConta((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...newConta,
        saldo: Number(newConta.saldo),
        data: newConta.data ? new Date(newConta.data).toISOString() : null,
      };

      await contasServices.createConta(formattedData);
      setNewConta({ nome: '', saldo: '', tipo: '', data: '' });
      await fetchContas();
      showAlert('Conta adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      showAlert('Falha ao adicionar conta', 'danger');
    }
  }, [fetchContas, newConta, showAlert]);

  const handleEdit = useCallback((conta) => {
    setEditingId(conta._id);
    setEditedConta({
      ...conta,
      data: conta.data ? new Date(conta.data).toISOString().split('T')[0] : '',
    });
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedConta((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      const formattedData = {
        ...editedConta,
        saldo: Number(editedConta.saldo),
        data: editedConta.data ? new Date(editedConta.data).toISOString() : null,
      };

      await contasServices.updateConta(editingId, formattedData);
      setEditingId(null);
      await fetchContas();
      showAlert('Conta atualizada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar conta:', error);
      showAlert('Falha ao atualizar conta', 'danger');
    }
  }, [editedConta, editingId, fetchContas, showAlert]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta conta?')) return;

    try {
      await contasServices.deleteConta(id);
      await fetchContas();
      showAlert('Conta excluída com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      showAlert('Falha ao excluir conta', 'danger');
    }
  }, [fetchContas, showAlert]);

  const handleShowDetails = useCallback((conta) => {
    setDetailsConta(conta);
    setShowDetailsModal(true);
  }, []);

  const handleHideDetails = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }, []);

  return {
    contas,
    newConta,
    editingId,
    editedConta,
    showDetailsModal,
    detailsConta,
    alert,
    clearAlert,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleHideDetails,
    formatDate,
    setEditingId,
  };
}
