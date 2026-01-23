import { useCallback, useEffect, useMemo, useState } from 'react';
import { parcelamentosServices } from '../services/ParcelamentosServices';

export function useParcelamentosUtils() {
  const [parcelamentos, setParcelamentos] = useState([]);
  const [newParcelamento, setNewParcelamento] = useState({
    descricao: '',
    valorTotal: '',
    numeroParcelas: '',
    dataInicio: '',
    categoria: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedParcelamento, setEditedParcelamento] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsParcelamento, setDetailsParcelamento] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchParcelamentos = useCallback(async () => {
    try {
      const data = await parcelamentosServices.getParcelamentos();
      setParcelamentos(data);
    } catch (error) {
      console.error('Erro ao buscar parcelamentos:', error);
      showAlert('Erro ao buscar parcelamentos', 'danger');
    }
  }, [showAlert]);

  const fetchCategorias = useCallback(async () => {
    try {
      const data = await parcelamentosServices.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      showAlert('Erro ao buscar categorias', 'danger');
    }
  }, [showAlert]);

  useEffect(() => {
    fetchParcelamentos();
    fetchCategorias();
  }, [fetchParcelamentos, fetchCategorias]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setNewParcelamento((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...newParcelamento,
        valorTotal: Number(newParcelamento.valorTotal),
        numeroParcelas: Number(newParcelamento.numeroParcelas),
        dataInicio: newParcelamento.dataInicio ? new Date(newParcelamento.dataInicio).toISOString() : null,
      };

      await parcelamentosServices.createParcelamento(payload);
      setNewParcelamento({ descricao: '', valorTotal: '', numeroParcelas: '', dataInicio: '', categoria: '' });
      await fetchParcelamentos();
      showAlert('Parcelamento adicionado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar parcelamento:', error);
      showAlert('Falha ao adicionar parcelamento', 'danger');
    }
  }, [fetchParcelamentos, newParcelamento, showAlert]);

  const handleEdit = useCallback((parcelamento) => {
    setEditingId(parcelamento._id);

    const categoriaId = typeof parcelamento?.categoria === 'object' ? parcelamento.categoria?._id : parcelamento?.categoria;

    setEditedParcelamento({
      ...parcelamento,
      dataInicio: parcelamento.dataInicio ? new Date(parcelamento.dataInicio).toISOString().split('T')[0] : '',
      categoria: categoriaId,
    });
  }, []);

  const handleEditChange = useCallback((event) => {
    const { name, value } = event.target;
    setEditedParcelamento((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      const payload = {
        ...editedParcelamento,
        valorTotal: Number(editedParcelamento.valorTotal),
        numeroParcelas: Number(editedParcelamento.numeroParcelas),
        dataInicio: editedParcelamento.dataInicio ? new Date(editedParcelamento.dataInicio).toISOString() : null,
      };

      await parcelamentosServices.updateParcelamento(editingId, payload);
      setEditingId(null);
      await fetchParcelamentos();
      showAlert('Parcelamento atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar parcelamento:', error);
      showAlert('Falha ao atualizar parcelamento', 'danger');
    }
  }, [editedParcelamento, editingId, fetchParcelamentos, showAlert]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este parcelamento?')) return;

    try {
      await parcelamentosServices.deleteParcelamento(id);
      await fetchParcelamentos();
      showAlert('Parcelamento excluído com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar parcelamento:', error);
      showAlert('Falha ao excluir parcelamento', 'danger');
    }
  }, [fetchParcelamentos, showAlert]);

  const handleShowDetails = useCallback((parcelamento) => {
    setDetailsParcelamento(parcelamento);
    setShowDetailsModal(true);
  }, []);

  const handleHideDetails = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  const chartData = useMemo(() => {
    const safeCategorias = categorias || [];
    const safeParcelamentos = parcelamentos || [];

    return {
      labels: safeCategorias.map((categoria) => categoria.nome),
      datasets: [
        {
          label: 'Total de Parcelamentos por Categoria',
          data: safeCategorias.map((categoria) =>
            safeParcelamentos
              .filter((p) => {
                const categoriaId = typeof p?.categoria === 'object' ? p.categoria?._id : p?.categoria;
                return categoriaId === categoria._id;
              })
              .reduce((acc, curr) => acc + (Number(curr.valorTotal) || 0), 0)
          ),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }, [categorias, parcelamentos]);

  return {
    parcelamentos,
    newParcelamento,
    categorias,
    editingId,
    editedParcelamento,
    showDetailsModal,
    detailsParcelamento,
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
