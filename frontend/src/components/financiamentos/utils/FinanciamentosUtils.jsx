import { useCallback, useEffect, useMemo, useState } from 'react';
import { financiamentosServices } from '../services/FinanciamentosServices';

export function useFinanciamentosUtils() {
  const [financiamentos, setFinanciamentos] = useState([]);
  const [newFinanciamento, setNewFinanciamento] = useState({
    descricao: '',
    valor_total: '',
    taxa_juros: '',
    parcelas_totais: '',
    data_inicio: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editedFinanciamento, setEditedFinanciamento] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsFinanciamento, setDetailsFinanciamento] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchFinanciamentos = useCallback(async () => {
    try {
      const data = await financiamentosServices.getFinanciamentos();
      setFinanciamentos(data);
    } catch (error) {
      console.error('Erro ao buscar financiamentos:', error);
      showAlert('Erro ao buscar financiamentos', 'danger');
    }
  }, [showAlert]);

  useEffect(() => {
    fetchFinanciamentos();
  }, [fetchFinanciamentos]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setNewFinanciamento((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...newFinanciamento,
        valor_total: Number(newFinanciamento.valor_total),
        taxa_juros: Number(newFinanciamento.taxa_juros),
        parcelas_totais: Number(newFinanciamento.parcelas_totais),
        data_inicio: newFinanciamento.data_inicio ? new Date(newFinanciamento.data_inicio).toISOString() : null,
      };

      await financiamentosServices.createFinanciamento(payload);
      setNewFinanciamento({ descricao: '', valor_total: '', taxa_juros: '', parcelas_totais: '', data_inicio: '' });
      await fetchFinanciamentos();
      showAlert('Financiamento adicionado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar financiamento:', error);
      showAlert('Falha ao adicionar financiamento', 'danger');
    }
  }, [fetchFinanciamentos, newFinanciamento, showAlert]);

  const handleEdit = useCallback((financiamento) => {
    setEditingId(financiamento._id);
    setEditedFinanciamento({
      ...financiamento,
      data_inicio: financiamento.data_inicio ? new Date(financiamento.data_inicio).toISOString().split('T')[0] : '',
    });
  }, []);

  const handleEditChange = useCallback((event) => {
    const { name, value } = event.target;
    setEditedFinanciamento((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      const payload = {
        ...editedFinanciamento,
        valor_total: Number(editedFinanciamento.valor_total),
        taxa_juros: Number(editedFinanciamento.taxa_juros),
        parcelas_totais: Number(editedFinanciamento.parcelas_totais),
        data_inicio: editedFinanciamento.data_inicio ? new Date(editedFinanciamento.data_inicio).toISOString() : null,
      };

      await financiamentosServices.updateFinanciamento(editingId, payload);
      setEditingId(null);
      await fetchFinanciamentos();
      showAlert('Financiamento atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar financiamento:', error);
      showAlert('Falha ao atualizar financiamento', 'danger');
    }
  }, [editedFinanciamento, editingId, fetchFinanciamentos, showAlert]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este financiamento?')) return;

    try {
      await financiamentosServices.deleteFinanciamento(id);
      await fetchFinanciamentos();
      showAlert('Financiamento excluído com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar financiamento:', error);
      showAlert('Falha ao excluir financiamento', 'danger');
    }
  }, [fetchFinanciamentos, showAlert]);

  const handleShowDetails = useCallback((financiamento) => {
    setDetailsFinanciamento(financiamento);
    setShowDetailsModal(true);
  }, []);

  const handleHideDetails = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  const chartData = useMemo(() => {
    const safe = financiamentos || [];
    return {
      labels: safe.map((f) => f.descricao),
      datasets: [
        {
          label: 'Valor Total dos Financiamentos',
          data: safe.map((f) => Number(f.valor_total) || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }, [financiamentos]);

  return {
    financiamentos,
    newFinanciamento,
    editingId,
    editedFinanciamento,
    showDetailsModal,
    detailsFinanciamento,
    alert,
    clearAlert,
    chartData,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleHideDetails,
    setEditingId,
  };
}
