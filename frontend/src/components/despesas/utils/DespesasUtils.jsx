import { useCallback, useEffect, useMemo, useState } from 'react';
import { despesasServices } from '../services/DespesasServices';

export function useDespesasUtils() {
  const [despesas, setDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newDespesa, setNewDespesa] = useState({
    descricao: '',
    valor: '',
    data: '',
    categoria: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editedDespesa, setEditedDespesa] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsDespesa, setDetailsDespesa] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchDespesas = useCallback(async () => {
    try {
      const data = await despesasServices.getDespesas();
      setDespesas(data);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      showAlert('Erro ao buscar despesas', 'danger');
    }
  }, [showAlert]);

  const fetchCategorias = useCallback(async () => {
    try {
      const data = await despesasServices.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      showAlert('Erro ao buscar categorias', 'danger');
    }
  }, [showAlert]);

  useEffect(() => {
    fetchDespesas();
    fetchCategorias();
  }, [fetchDespesas, fetchCategorias]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setNewDespesa((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...newDespesa,
        valor: Number(newDespesa.valor),
        data: newDespesa.data ? new Date(newDespesa.data).toISOString() : null,
      };

      await despesasServices.createDespesa(payload);
      setNewDespesa({ descricao: '', valor: '', data: '', categoria: '' });
      await fetchDespesas();
      showAlert('Despesa adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      showAlert('Falha ao adicionar despesa', 'danger');
    }
  }, [fetchDespesas, newDespesa, showAlert]);

  const handleEdit = useCallback((despesa) => {
    setEditingId(despesa._id);

    const categoriaId = typeof despesa?.categoria === 'object' ? despesa.categoria?._id : despesa?.categoria;

    setEditedDespesa({
      ...despesa,
      data: despesa.data ? new Date(despesa.data).toISOString().split('T')[0] : '',
      categoria: categoriaId,
    });
  }, []);

  const handleEditChange = useCallback((event) => {
    const { name, value } = event.target;
    setEditedDespesa((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      const payload = {
        ...editedDespesa,
        valor: Number(editedDespesa.valor),
        data: editedDespesa.data ? new Date(editedDespesa.data).toISOString() : null,
      };

      await despesasServices.updateDespesa(editingId, payload);
      setEditingId(null);
      await fetchDespesas();
      showAlert('Despesa atualizada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar despesa:', error);
      showAlert('Falha ao atualizar despesa', 'danger');
    }
  }, [editedDespesa, editingId, fetchDespesas, showAlert]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta despesa?')) return;

    try {
      await despesasServices.deleteDespesa(id);
      await fetchDespesas();
      showAlert('Despesa excluída com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      showAlert('Falha ao excluir despesa', 'danger');
    }
  }, [fetchDespesas, showAlert]);

  const handleShowDetails = useCallback((despesa) => {
    setDetailsDespesa(despesa);
    setShowDetailsModal(true);
  }, []);

  const handleHideDetails = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  const chartData = useMemo(() => {
    const safeCategorias = categorias || [];
    const safeDespesas = despesas || [];

    const totalsByCategoriaId = safeDespesas.reduce((acc, despesa) => {
      const categoriaId = typeof despesa?.categoria === 'object' ? despesa.categoria?._id : despesa?.categoria;
      if (!categoriaId) return acc;
      acc[categoriaId] = (acc[categoriaId] || 0) + (Number(despesa.valor) || 0);
      return acc;
    }, {});

    const categoriasDespesa = safeCategorias
      .filter((c) => c?.tipo === 'despesa')
      .map((c) => ({ ...c, total: totalsByCategoriaId[c._id] || 0 }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);

    const MAX_BARS = 10;
    const topCategorias = categoriasDespesa.slice(0, MAX_BARS);
    const outrasCategorias = categoriasDespesa.slice(MAX_BARS);
    const outrasTotal = outrasCategorias.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

    const labels = topCategorias.map((categoria) => categoria.nome);
    const values = topCategorias.map((categoria) => categoria.total);

    if (outrasTotal > 0) {
      labels.push('Outras');
      values.push(outrasTotal);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Total de Despesas por Categoria',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };
  }, [categorias, despesas]);

  return {
    despesas,
    categorias,
    newDespesa,
    editingId,
    editedDespesa,
    showDetailsModal,
    detailsDespesa,
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
    chartData,
    setEditingId,
  };
}
