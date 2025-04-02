import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import OrcamentosServices from '../services/OrcamentosServices';

/**
 * Hook para gerenciamento de orçamentos
 */
export const useOrcamentos = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [formData, setFormData] = useState({
    descricao: '',
    valor_planejado: '',
    categoria: '',
    mes: format(new Date(), 'MM'),
    ano: format(new Date(), 'yyyy'),
    observacoes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsOrcamento, setDetailsOrcamento] = useState(null);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [historicoAnual, setHistoricoAnual] = useState([]);
  const [historicoCategoria, setHistoricoCategoria] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  /**
   * Busca todos os orçamentos, categorias e despesas
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [orcamentosRes, categoriasRes, despesasRes] = await Promise.all([
        OrcamentosServices.fetchOrcamentos(),
        OrcamentosServices.fetchCategorias(),
        OrcamentosServices.fetchDespesas()
      ]);
      
      setOrcamentos(orcamentosRes.data);
      setCategorias(categoriasRes.data);
      setDespesas(despesasRes.data);
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
    const { name, value } = e.target;
    if (name === 'valor_planejado') {
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
   * Abre o modal para edição de um orçamento existente
   */
  const handleEdit = useCallback((orcamento) => {
    setEditingId(orcamento.id);
    setFormData({
      descricao: orcamento.descricao,
      valor_planejado: orcamento.valor_planejado.toString(),
      categoria: orcamento.categoriaId,
      mes: orcamento.mes,
      ano: orcamento.ano,
      observacoes: orcamento.observacoes || ''
    });
    setShowModal(true);
  }, []);

  /**
   * Limpa o formulário e abre o modal para adicionar um novo orçamento
   */
  const handleAdd = useCallback(() => {
    setEditingId(null);
    setFormData({
      descricao: '',
      valor_planejado: '',
      categoria: '',
      mes: format(new Date(), 'MM'),
      ano: format(new Date(), 'yyyy'),
      observacoes: ''
    });
    setShowModal(true);
  }, []);

  /**
   * Salva o orçamento (adiciona novo ou atualiza existente)
   */
  const handleSave = useCallback(async () => {
    try {
      if (!formData.descricao || !formData.valor_planejado || !formData.categoria) {
        showAlert('Preencha todos os campos obrigatórios', 'warning');
        return;
      }

      const orcamentoData = {
        ...formData,
        valor_planejado: parseFloat(formData.valor_planejado),
        categoriaId: formData.categoria
      };
      
      if (editingId) {
        await OrcamentosServices.updateOrcamento(editingId, orcamentoData);
        showAlert('Orçamento atualizado com sucesso', 'success');
      } else {
        await OrcamentosServices.addOrcamento(orcamentoData);
        showAlert('Orçamento adicionado com sucesso', 'success');
      }
      
      await fetchData();
      setShowModal(false);
    } catch (err) {
      setError('Erro ao salvar orçamento. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao salvar orçamento', 'danger');
    }
  }, [formData, editingId, fetchData, showAlert]);

  /**
   * Remove um orçamento existente
   */
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await OrcamentosServices.deleteOrcamento(id);
        await fetchData();
        showAlert('Orçamento excluído com sucesso', 'success');
      } catch (err) {
        setError('Erro ao excluir orçamento. Por favor, tente novamente.');
        console.error(err);
        showAlert('Erro ao excluir orçamento', 'danger');
      }
    }
  }, [fetchData, showAlert]);

  /**
   * Abre o modal de detalhes para um orçamento
   */
  const handleShowDetails = useCallback((orcamento) => {
    setDetailsOrcamento(orcamento);
    setShowDetailsModal(true);
  }, []);

  /**
   * Abre o modal de histórico anual para uma categoria
   */
  const handleShowHistorico = useCallback(async (categoriaId) => {
    try {
      setIsLoading(true);
      const response = await OrcamentosServices.fetchHistoricoAnual(categoriaId);
      setHistoricoAnual(response.data);
      setHistoricoCategoria(categoriaId);
      setShowHistoricoModal(true);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      showAlert('Erro ao buscar histórico anual', 'danger');
      setIsLoading(false);
    }
  }, [showAlert]);

  /**
   * Calcula o valor atual gasto em uma categoria
   */
  const calcularValorAtual = useCallback((categoriaId, mes, ano) => {
    return despesas
      .filter(d => 
        d.categoriaId === categoriaId && 
        format(new Date(d.data), 'MM') === mes &&
        format(new Date(d.data), 'yyyy') === ano
      )
      .reduce((total, despesa) => total + despesa.valor, 0);
  }, [despesas]);

  /**
   * Calcula a porcentagem de uso do orçamento
   */
  const calcularPorcentagemUso = useCallback((valorPlanejado, valorAtual) => {
    if (valorPlanejado === 0) return 0;
    return (valorAtual / valorPlanejado) * 100;
  }, []);

  /**
   * Determina a variante de cor para a barra de progresso
   */
  const getProgressBarVariant = useCallback((porcentagem) => {
    if (porcentagem <= 70) return 'success';
    if (porcentagem <= 90) return 'warning';
    return 'danger';
  }, []);

  /**
   * Obtém o nome do mês por número
   */
  const getNomeMes = useCallback((mesNumero) => {
    const data = new Date(2023, parseInt(mesNumero) - 1, 1);
    return format(data, 'MMMM', { locale: ptBR });
  }, []);

  /**
   * Formata o valor monetário para exibição
   */
  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  // Carrega os dados ao iniciar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    orcamentos,
    categorias,
    despesas,
    formData,
    isLoading,
    error,
    showModal,
    showDetailsModal,
    detailsOrcamento,
    showHistoricoModal,
    historicoAnual,
    historicoCategoria,
    alert,
    editingId,
    handleChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSave,
    handleShowDetails,
    handleShowHistorico,
    setShowModal,
    setShowDetailsModal,
    setShowHistoricoModal,
    calcularValorAtual,
    calcularPorcentagemUso,
    getProgressBarVariant,
    getNomeMes,
    formatCurrency,
    showAlert
  };
};

export const OrcamentosUtils = {
  useOrcamentos
}; 