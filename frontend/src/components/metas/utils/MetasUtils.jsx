import { useCallback, useEffect, useMemo, useState } from 'react';
import { metasServices } from '../services/MetasServices';

export function useMetasUtils() {
  const [metas, setMetas] = useState([]);
  const [newMeta, setNewMeta] = useState({
    descricao: '',
    valor_alvo: '',
    valor_atual: '',
    data_limite: '',
    categoria: '',
    recorrente: false,
    periodo_recorrencia: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editedMeta, setEditedMeta] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsMeta, setDetailsMeta] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('data_limite');
  const [estatisticas, setEstatisticas] = useState(null);

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchMetas = useCallback(async () => {
    try {
      const data = await metasServices.getMetas();
      setMetas(data);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      showAlert('Erro ao buscar metas', 'danger');
    }
  }, [showAlert]);

  const fetchEstatisticas = useCallback(async () => {
    try {
      const data = await metasServices.getEstatisticas();
      setEstatisticas(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  }, []);

  useEffect(() => {
    fetchMetas();
    fetchEstatisticas();
  }, [fetchMetas, fetchEstatisticas]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setNewMeta((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const metaData = {
        descricao: newMeta.descricao,
        valor_alvo: parseFloat(newMeta.valor_alvo),
        valor_atual: parseFloat(newMeta.valor_atual),
        data_limite: newMeta.data_limite,
        categoria: newMeta.categoria,
        recorrente: newMeta.recorrente,
      };

      if (newMeta.recorrente) {
        metaData.periodo_recorrencia = newMeta.periodo_recorrencia;
      }

      await metasServices.createMeta(metaData);

      setNewMeta({
        descricao: '',
        valor_alvo: '',
        valor_atual: '',
        data_limite: '',
        categoria: '',
        recorrente: false,
        periodo_recorrencia: '',
      });

      await fetchMetas();
      showAlert('Meta adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      showAlert('Falha ao adicionar meta', 'danger');
    }
  }, [fetchMetas, newMeta, showAlert]);

  const handleEdit = useCallback((meta) => {
    setEditingId(meta._id);
    setEditedMeta({
      ...meta,
      data_limite: meta.data_limite ? new Date(meta.data_limite).toISOString().split('T')[0] : '',
    });
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEditedMeta((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      const metaData = {
        ...editedMeta,
        valor_alvo: parseFloat(editedMeta.valor_alvo),
        valor_atual: parseFloat(editedMeta.valor_atual),
      };

      if (!editedMeta.recorrente) {
        delete metaData.periodo_recorrencia;
      }

      await metasServices.updateMeta(editingId, metaData);
      setEditingId(null);
      await fetchMetas();
      showAlert('Meta atualizada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar meta:', error);
      showAlert('Falha ao atualizar meta', 'danger');
    }
  }, [editedMeta, editingId, fetchMetas, showAlert]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta meta?')) return;

    try {
      await metasServices.deleteMeta(id);
      await fetchMetas();
      showAlert('Meta excluída com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      showAlert('Falha ao excluir meta', 'danger');
    }
  }, [fetchMetas, showAlert]);

  const handleShowDetails = useCallback((meta) => {
    setDetailsMeta(meta);
    setShowDetailsModal(true);
  }, []);

  const handleHideDetails = useCallback(() => {
    setShowDetailsModal(false);
  }, []);

  const filtrarMetas = useCallback(() => {
    return (metas || []).filter((meta) =>
      String(meta.descricao || '').toLowerCase().includes(String(filtro || '').toLowerCase()) ||
      String(meta.categoria || '').toLowerCase().includes(String(filtro || '').toLowerCase())
    );
  }, [filtro, metas]);

  const ordenarMetas = useCallback((metasFiltradas) => {
    return [...metasFiltradas].sort((a, b) => {
      if (ordenacao === 'data_limite') {
        return new Date(a.data_limite) - new Date(b.data_limite);
      }
      if (ordenacao === 'progresso') {
        return (b.valor_atual / b.valor_alvo) - (a.valor_atual / a.valor_alvo);
      }
      if (ordenacao === 'valor_alvo') {
        return b.valor_alvo - a.valor_alvo;
      }
      return 0;
    });
  }, [ordenacao]);

  const metasFiltradas = useMemo(() => ordenarMetas(filtrarMetas()), [filtrarMetas, ordenarMetas]);

  const chartData = useMemo(() => ({
    labels: (metas || []).map((meta) => meta.descricao),
    datasets: [
      {
        label: 'Progresso das Metas',
        data: (metas || []).map((meta) => (Number(meta.valor_atual) / Number(meta.valor_alvo)) * 100),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }), [metas]);

  const chartOptions = useMemo(() => ({
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }), []);

  return {
    metas,
    newMeta,
    editingId,
    editedMeta,
    showDetailsModal,
    detailsMeta,
    alert,
    clearAlert,
    filtro,
    ordenacao,
    estatisticas,
    metasFiltradas,
    chartData,
    chartOptions,
    setFiltro,
    setOrdenacao,
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
