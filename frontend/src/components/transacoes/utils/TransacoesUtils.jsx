import { useCallback, useEffect, useMemo, useState } from 'react';
import { transacoesServices } from '../services/TransacoesServices';

export function useTransacoesUtils() {
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newTransacao, setNewTransacao] = useState({
    conta: '',
    categoria: '',
    descricao: '',
    valor: '',
    data: '',
    tipo: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editedTransacao, setEditedTransacao] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTransacao, setDetailsTransacao] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchTransacoes = useCallback(async () => {
    try {
      const data = await transacoesServices.getTransacoes();
      setTransacoes(data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      showAlert('Erro ao buscar transações', 'danger');
    }
  }, [showAlert]);

  const fetchContas = useCallback(async () => {
    try {
      const data = await transacoesServices.getContas();
      setContas(data);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
    }
  }, []);

  const fetchCategorias = useCallback(async () => {
    try {
      const data = await transacoesServices.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }, []);

  useEffect(() => {
    fetchTransacoes();
    fetchContas();
    fetchCategorias();
  }, [fetchTransacoes, fetchContas, fetchCategorias]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewTransacao((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await transacoesServices.createTransacao(newTransacao);
      setNewTransacao({ conta: '', categoria: '', descricao: '', valor: '', data: '', tipo: '' });
      await fetchTransacoes();
      showAlert('Transação adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      showAlert('Falha ao adicionar transação', 'danger');
    }
  }, [newTransacao, fetchTransacoes, showAlert]);

  const handleEdit = useCallback((transacao) => {
    setEditingId(transacao._id);
    setEditedTransacao({
      ...transacao,
      conta: typeof transacao.conta === 'object' ? transacao.conta?._id : transacao.conta,
      categoria: typeof transacao.categoria === 'object' ? transacao.categoria?._id : transacao.categoria,
      data: new Date(transacao.data).toISOString().split('T')[0],
    });
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedTransacao((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      const payload = {
        ...editedTransacao,
        conta: typeof editedTransacao.conta === 'object' ? editedTransacao.conta?._id : editedTransacao.conta,
        categoria: typeof editedTransacao.categoria === 'object' ? editedTransacao.categoria?._id : editedTransacao.categoria,
      };
      await transacoesServices.updateTransacao(editingId, payload);
      setEditingId(null);
      await fetchTransacoes();
      showAlert('Transação atualizada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      showAlert('Falha ao atualizar transação', 'danger');
    }
  }, [editedTransacao, editingId, fetchTransacoes, showAlert]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
    try {
      await transacoesServices.deleteTransacao(id);
      await fetchTransacoes();
      showAlert('Transação excluída com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      showAlert('Falha ao excluir transação', 'danger');
    }
  }, [fetchTransacoes, showAlert]);

  const handleShowDetails = useCallback((transacao) => {
    setDetailsTransacao(transacao);
    setShowDetailsModal(true);
  }, []);

  const handleHideDetails = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  const formatDate = useCallback((dateString) => new Date(dateString).toLocaleDateString(), []);

  return {
    transacoes,
    contas,
    categorias,
    newTransacao,
    editingId,
    editedTransacao,
    showDetailsModal,
    detailsTransacao,
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
