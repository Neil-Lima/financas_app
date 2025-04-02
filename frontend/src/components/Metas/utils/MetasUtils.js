import { useState, useEffect, useCallback } from 'react';
import { format, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MetasServices from '../services/MetasServices';

/**
 * Hook para gerenciamento de metas
 */
export const useMetas = () => {
  const [metas, setMetas] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '',
    valor_alvo: '',
    valor_atual: '',
    data_limite: format(new Date(), 'yyyy-MM-dd'),
    categoria: '',
    recorrente: false,
    periodo_recorrencia: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProgressoModal, setShowProgressoModal] = useState(false);
  const [detailsMeta, setDetailsMeta] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('data_limite');

  /**
   * Busca todas as metas e estatísticas
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [metasRes, estatisticasRes] = await Promise.all([
        MetasServices.fetchMetas(),
        MetasServices.fetchEstatisticas()
      ]);
      
      setMetas(metasRes.data);
      setEstatisticas(estatisticasRes.data);
    } catch (err) {
      setError('Erro ao carregar dados. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao carregar dados', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mostra uma mensagem de alerta
   */
  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  /**
   * Manipula mudanças nos campos do formulário
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'valor_alvo' || name === 'valor_atual') {
      // Remove caracteres não numéricos, exceto ponto decimal
      const validValue = value.replace(/[^\d.]/g, '');
      // Garante que haja apenas um ponto decimal
      const parts = validValue.split('.');
      const formattedValue = parts.length > 1 
        ? `${parts[0]}.${parts.slice(1).join('')}` 
        : validValue;
      
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  /**
   * Abre o modal para edição de uma meta existente
   */
  const handleEdit = useCallback((meta) => {
    setEditingId(meta.id);
    setFormData({
      descricao: meta.descricao,
      valor_alvo: meta.valor_alvo.toString(),
      valor_atual: meta.valor_atual.toString(),
      data_limite: format(new Date(meta.data_limite), 'yyyy-MM-dd'),
      categoria: meta.categoria,
      recorrente: meta.recorrente || false,
      periodo_recorrencia: meta.periodo_recorrencia || ''
    });
    setShowModal(true);
  }, []);

  /**
   * Limpa o formulário e abre o modal para adicionar uma nova meta
   */
  const handleAdd = useCallback(() => {
    setEditingId(null);
    setFormData({
      descricao: '',
      valor_alvo: '',
      valor_atual: '',
      data_limite: format(new Date(), 'yyyy-MM-dd'),
      categoria: '',
      recorrente: false,
      periodo_recorrencia: ''
    });
    setShowModal(true);
  }, []);

  /**
   * Salva a meta (adiciona nova ou atualiza existente)
   */
  const handleSave = useCallback(async () => {
    try {
      if (!formData.descricao || !formData.valor_alvo || !formData.data_limite) {
        showAlert('Preencha todos os campos obrigatórios', 'warning');
        return;
      }

      const metaData = {
        ...formData,
        valor_alvo: parseFloat(formData.valor_alvo),
        valor_atual: parseFloat(formData.valor_atual || 0)
      };
      
      if (!metaData.recorrente) {
        delete metaData.periodo_recorrencia;
      }
      
      if (editingId) {
        await MetasServices.updateMeta(editingId, metaData);
        showAlert('Meta atualizada com sucesso', 'success');
      } else {
        await MetasServices.addMeta(metaData);
        showAlert('Meta adicionada com sucesso', 'success');
      }
      
      await fetchData();
      setShowModal(false);
    } catch (err) {
      setError('Erro ao salvar meta. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao salvar meta', 'danger');
    }
  }, [formData, editingId, fetchData, showAlert]);

  /**
   * Remove uma meta existente
   */
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        await MetasServices.deleteMeta(id);
        await fetchData();
        showAlert('Meta excluída com sucesso', 'success');
      } catch (err) {
        setError('Erro ao excluir meta. Por favor, tente novamente.');
        console.error(err);
        showAlert('Erro ao excluir meta', 'danger');
      }
    }
  }, [fetchData, showAlert]);

  /**
   * Abre o modal de detalhes para uma meta
   */
  const handleShowDetails = useCallback((meta) => {
    setDetailsMeta(meta);
    setShowDetailsModal(true);
  }, []);

  /**
   * Abre o modal para atualizar o progresso de uma meta
   */
  const handleShowProgressoModal = useCallback((meta) => {
    setDetailsMeta(meta);
    setFormData(prev => ({
      ...prev,
      valor_atual: meta.valor_atual.toString()
    }));
    setShowProgressoModal(true);
  }, []);

  /**
   * Atualiza o progresso de uma meta
   */
  const handleAtualizarProgresso = useCallback(async () => {
    try {
      if (!detailsMeta || !formData.valor_atual) {
        showAlert('Informe um valor válido', 'warning');
        return;
      }

      const valorAtual = parseFloat(formData.valor_atual);
      await MetasServices.atualizarProgresso(detailsMeta.id, valorAtual);
      
      await fetchData();
      setShowProgressoModal(false);
      showAlert('Progresso atualizado com sucesso', 'success');
    } catch (err) {
      setError('Erro ao atualizar progresso. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao atualizar progresso', 'danger');
    }
  }, [detailsMeta, formData.valor_atual, fetchData, showAlert]);

  /**
   * Filtra as metas com base no critério de pesquisa
   */
  const filtrarMetas = useCallback(() => {
    if (!filtro) return metas;
    
    return metas.filter(meta =>
      meta.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
      meta.categoria.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [metas, filtro]);

  /**
   * Ordena as metas com base no critério selecionado
   */
  const ordenarMetas = useCallback((metasFiltradas) => {
    switch (ordenacao) {
      case 'data_limite':
        return [...metasFiltradas].sort((a, b) => new Date(a.data_limite) - new Date(b.data_limite));
      case 'progresso':
        return [...metasFiltradas].sort((a, b) => 
          (b.valor_atual / b.valor_alvo) - (a.valor_atual / a.valor_alvo)
        );
      case 'valor_alvo':
        return [...metasFiltradas].sort((a, b) => b.valor_alvo - a.valor_alvo);
      default:
        return metasFiltradas;
    }
  }, [ordenacao]);

  /**
   * Calcula o progresso percentual de uma meta
   */
  const calcularProgresso = useCallback((valorAtual, valorAlvo) => {
    if (valorAlvo === 0) return 0;
    return (valorAtual / valorAlvo) * 100;
  }, []);

  /**
   * Verifica se uma meta está atrasada
   */
  const isMetaAtrasada = useCallback((meta) => {
    const hoje = new Date();
    const dataLimite = parseISO(meta.data_limite);
    const progresso = calcularProgresso(meta.valor_atual, meta.valor_alvo);
    
    return isAfter(hoje, dataLimite) && progresso < 100;
  }, [calcularProgresso]);

  /**
   * Determina a variante de cor para a barra de progresso
   */
  const getProgressBarVariant = useCallback((meta) => {
    const progresso = calcularProgresso(meta.valor_atual, meta.valor_alvo);
    
    if (isMetaAtrasada(meta)) return 'danger';
    if (progresso >= 100) return 'success';
    if (progresso >= 75) return 'info';
    if (progresso >= 50) return 'primary';
    if (progresso >= 25) return 'warning';
    return 'secondary';
  }, [calcularProgresso, isMetaAtrasada]);

  /**
   * Formata o valor monetário para exibição
   */
  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  /**
   * Formata a data para exibição
   */
  const formatDate = useCallback((dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  }, []);

  // Carrega os dados ao iniciar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    metas: ordenarMetas(filtrarMetas()),
    estatisticas,
    formData,
    isLoading,
    error,
    showModal,
    showDetailsModal,
    showProgressoModal,
    detailsMeta,
    alert,
    filtro,
    ordenacao,
    editingId,
    handleChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSave,
    handleShowDetails,
    handleShowProgressoModal,
    handleAtualizarProgresso,
    setShowModal,
    setShowDetailsModal,
    setShowProgressoModal,
    setFiltro,
    setOrdenacao,
    calcularProgresso,
    isMetaAtrasada,
    getProgressBarVariant,
    formatCurrency,
    formatDate,
    showAlert
  };
};

export const MetasUtils = {
  useMetas
}; 