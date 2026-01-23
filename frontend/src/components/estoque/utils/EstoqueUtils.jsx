import { useCallback, useEffect, useMemo, useState } from 'react';
import { estoqueServices } from '../services/EstoqueServices';

export function useEstoqueUtils() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newProduto, setNewProduto] = useState({
    nome: '',
    quantidade: '',
    preco: '',
    fornecedor: '',
    categoria: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editedProduto, setEditedProduto] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsProduto, setDetailsProduto] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchProdutos = useCallback(async () => {
    try {
      const data = await estoqueServices.getProdutos();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showAlert('Erro ao buscar produtos', 'danger');
    }
  }, [showAlert]);

  const fetchCategorias = useCallback(async () => {
    try {
      const data = await estoqueServices.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      showAlert('Erro ao buscar categorias', 'danger');
    }
  }, [showAlert]);

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
  }, [fetchProdutos, fetchCategorias]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setNewProduto((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...newProduto,
        quantidade: Number(newProduto.quantidade),
        preco: Number(newProduto.preco),
      };

      await estoqueServices.createProduto(payload);
      setNewProduto({ nome: '', quantidade: '', preco: '', fornecedor: '', categoria: '' });
      await fetchProdutos();
      showAlert('Produto adicionado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      showAlert('Falha ao adicionar produto', 'danger');
    }
  }, [fetchProdutos, newProduto, showAlert]);

  const handleEdit = useCallback((produto) => {
    setEditingId(produto._id);

    const categoriaId = typeof produto?.categoria === 'object' ? produto.categoria?._id : produto?.categoria;

    setEditedProduto({
      ...produto,
      categoria: categoriaId,
    });
  }, []);

  const handleEditChange = useCallback((event) => {
    const { name, value } = event.target;
    setEditedProduto((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      const payload = {
        ...editedProduto,
        quantidade: Number(editedProduto.quantidade),
        preco: Number(editedProduto.preco),
      };

      await estoqueServices.updateProduto(editingId, payload);
      setEditingId(null);
      await fetchProdutos();
      showAlert('Produto atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      showAlert('Falha ao atualizar produto', 'danger');
    }
  }, [editedProduto, editingId, fetchProdutos, showAlert]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await estoqueServices.deleteProduto(id);
      await fetchProdutos();
      showAlert('Produto excluído com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      showAlert('Falha ao excluir produto', 'danger');
    }
  }, [fetchProdutos, showAlert]);

  const handleShowDetails = useCallback((produto) => {
    setDetailsProduto(produto);
    setShowDetailsModal(true);
  }, []);

  const handleHideDetails = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  const categoriaUsageData = useMemo(() => {
    const count = {};

    (produtos || []).forEach((produto) => {
      const categoriaId = typeof produto?.categoria === 'object' ? produto.categoria?._id : produto?.categoria;
      if (!categoriaId) return;
      count[categoriaId] = (count[categoriaId] || 0) + 1;
    });

    const labels = Object.keys(count).map((categoriaId) => categorias.find((c) => c._id === categoriaId)?.nome || 'Desconhecida');
    const data = Object.values(count);

    return { labels, data };
  }, [categorias, produtos]);

  const pieChartData = useMemo(
    () => ({
      labels: categoriaUsageData.labels,
      datasets: [
        {
          data: categoriaUsageData.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        },
      ],
    }),
    [categoriaUsageData]
  );

  const barChartData = useMemo(
    () => ({
      labels: (produtos || []).map((p) => p.nome),
      datasets: [
        {
          label: 'Quantidade em Estoque',
          data: (produtos || []).map((p) => Number(p.quantidade) || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    }),
    [produtos]
  );

  return {
    produtos,
    categorias,
    newProduto,
    editingId,
    editedProduto,
    showDetailsModal,
    detailsProduto,
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
    setEditingId,
    categoriaUsageData,
    pieChartData,
    barChartData,
  };
}
