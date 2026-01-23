import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSocket } from '../../../hooks/useSocket';
import { orcamentosServices } from '../services/OrcamentosServices';

export function useOrcamentosUtils() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newOrcamento, setNewOrcamento] = useState({
    categoria: '',
    valor_planejado: '',
    valor_atual: 0,
    valor_restante: 0,
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    notas: '',
    recorrencia: 'nao_recorrente',
    prioridade: 3,
    metaEconomia: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedOrcamento, setEditedOrcamento] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsOrcamento, setDetailsOrcamento] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [comparacaoAnual, setComparacaoAnual] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchCategorias = useCallback(async () => {
    try {
      const data = await orcamentosServices.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      showAlert('Erro ao buscar categorias', 'danger');
    }
  }, [showAlert]);

  const fetchOrcamentos = useCallback(async (anoParam) => {
    try {
      const ano = anoParam ?? newOrcamento.ano;
      const data = await orcamentosServices.getOrcamentos(ano);
      setOrcamentos(data);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      showAlert('Erro ao buscar orçamentos', 'danger');
    }
  }, [newOrcamento.ano, showAlert]);

  useEffect(() => {
    fetchOrcamentos();
    fetchCategorias();
  }, [fetchOrcamentos, fetchCategorias]);

  // socket (usar o hook global)
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    const handler = () => fetchOrcamentos();
    socket.on('orcamentos_atualizados', handler);
    return () => {
      socket.off('orcamentos_atualizados', handler);
    };
  }, [socket, fetchOrcamentos]);

  useEffect(() => {
    const newAlerts = (orcamentos || [])
      .filter((o) => Number(o.valor_atual) > Number(o.valor_planejado))
      .map((o) => {
        const categoriaNome = typeof o.categoria === 'object' ? o.categoria?.nome : String(o.categoria);
        return `${categoriaNome}: Ultrapassou o limite em R$ ${(Number(o.valor_atual) - Number(o.valor_planejado)).toFixed(2)}`;
      });
    setAlerts(newAlerts);
  }, [orcamentos]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewOrcamento((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newOrcamento,
        valor_planejado: Number(newOrcamento.valor_planejado),
        valor_atual: Number(newOrcamento.valor_atual),
        valor_restante: Number(newOrcamento.valor_restante),
        mes: Number(newOrcamento.mes),
        ano: Number(newOrcamento.ano),
        prioridade: Number(newOrcamento.prioridade),
        metaEconomia: Number(newOrcamento.metaEconomia),
      };

      await orcamentosServices.createOrcamento(payload);

      setNewOrcamento({
        categoria: '',
        valor_planejado: '',
        valor_atual: 0,
        valor_restante: 0,
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear(),
        notas: '',
        recorrencia: 'nao_recorrente',
        prioridade: 3,
        metaEconomia: 0,
      });

      await fetchOrcamentos(payload.ano);
      showAlert('Orçamento adicionado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar orçamento:', error);
      showAlert('Falha ao adicionar orçamento', 'danger');
    }
  }, [fetchOrcamentos, newOrcamento, showAlert]);

  const handleEdit = useCallback((orcamento) => {
    setEditingId(orcamento._id);

    const categoriaId = typeof orcamento?.categoria === 'object' ? orcamento.categoria?._id : orcamento?.categoria;

    setEditedOrcamento({
      ...orcamento,
      categoria: categoriaId,
    });
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedOrcamento((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      const payload = {
        ...editedOrcamento,
        valor_planejado: Number(editedOrcamento.valor_planejado),
        valor_atual: Number(editedOrcamento.valor_atual),
        valor_restante: Number(editedOrcamento.valor_restante),
        mes: Number(editedOrcamento.mes),
        ano: Number(editedOrcamento.ano),
        prioridade: Number(editedOrcamento.prioridade),
        metaEconomia: Number(editedOrcamento.metaEconomia),
      };

      await orcamentosServices.updateOrcamento(editingId, payload);
      setEditingId(null);
      await fetchOrcamentos(payload.ano);
      showAlert('Orçamento atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar orçamento:', error);
      showAlert('Falha ao atualizar orçamento', 'danger');
    }
  }, [editedOrcamento, editingId, fetchOrcamentos, showAlert]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este orçamento?')) return;
    try {
      await orcamentosServices.deleteOrcamento(id);
      await fetchOrcamentos();
      showAlert('Orçamento excluído com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      showAlert('Falha ao excluir orçamento', 'danger');
    }
  }, [fetchOrcamentos, showAlert]);

  const handleShowDetails = useCallback((orcamento) => {
    setDetailsOrcamento(orcamento);
    setShowDetailsModal(true);
  }, []);

  const handleHideDetails = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  const handleCompararAnual = useCallback(async () => {
    try {
      const anoAtual = new Date().getFullYear();
      const anoAnterior = anoAtual - 1;
      const data = await orcamentosServices.compararAnual(anoAtual, anoAnterior);
      setComparacaoAnual(data);
    } catch (error) {
      console.error('Erro ao comparar orçamentos anuais:', error);
      showAlert('Falha ao comparar orçamentos anuais', 'danger');
    }
  }, [showAlert]);

  const chartData = useMemo(() => {
    const safeOrcamentos = orcamentos || [];
    return {
      labels: safeOrcamentos.map((o) => (typeof o.categoria === 'object' ? o.categoria?.nome : String(o.categoria))),
      datasets: [
        {
          label: 'Planejado',
          data: safeOrcamentos.map((o) => Number(o.valor_planejado) || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Atual',
          data: safeOrcamentos.map((o) => Number(o.valor_atual) || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };
  }, [orcamentos]);

  return {
    orcamentos,
    categorias,
    newOrcamento,
    alerts,
    editingId,
    editedOrcamento,
    showDetailsModal,
    detailsOrcamento,
    alert,
    clearAlert,
    comparacaoAnual,
    showInstructionsModal,
    chartData,
    setNewOrcamento,
    setEditingId,
    setShowInstructionsModal,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleHideDetails,
    handleCompararAnual,
  };
}
