import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TransacoesServices from '../services/TransacoesServices';

/**
 * Hook para gerenciar as transações
 */
export const useTransacoes = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data: format(new Date(), 'yyyy-MM-dd'),
    tipo: 'DESPESA',
    categoria: '',
    conta: '',
    observacao: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filtro, setFiltro] = useState({
    dataInicio: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    dataFim: format(new Date(), 'yyyy-MM-dd'),
    tipo: 'TODOS',
    categoria: 'TODOS',
    conta: 'TODOS'
  });

  /**
   * Busca todas as transações e dados relacionados
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [transacoesRes, contasRes, categoriasRes] = await Promise.all([
        TransacoesServices.fetchTransacoes(),
        TransacoesServices.fetchContas(),
        TransacoesServices.fetchCategorias()
      ]);
      
      setTransacoes(transacoesRes.data);
      setContas(contasRes.data);
      setCategorias(categoriasRes.data);
    } catch (err) {
      setError('Erro ao carregar dados. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Filtra as transações com base nos critérios selecionados
   */
  const transacoesFiltradas = useCallback(() => {
    return transacoes.filter(transacao => {
      const dataTransacao = new Date(transacao.data);
      const dataInicio = new Date(filtro.dataInicio);
      const dataFim = new Date(filtro.dataFim);
      
      // Ajusta dataFim para incluir todo o dia final
      dataFim.setHours(23, 59, 59, 999);
      
      const matchesTipo = filtro.tipo === 'TODOS' || transacao.tipo === filtro.tipo;
      const matchesCategoria = filtro.categoria === 'TODOS' || transacao.categoriaId === filtro.categoria;
      const matchesConta = filtro.conta === 'TODOS' || transacao.contaId === filtro.conta;
      const matchesData = dataTransacao >= dataInicio && dataTransacao <= dataFim;
      
      return matchesTipo && matchesCategoria && matchesConta && matchesData;
    });
  }, [transacoes, filtro]);

  /**
   * Manipula mudanças nos campos do formulário
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'valor') {
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
   * Abre o modal para edição de uma transação existente
   */
  const handleEdit = useCallback((transacao) => {
    setEditingId(transacao.id);
    setFormData({
      descricao: transacao.descricao,
      valor: transacao.valor.toString(),
      data: format(new Date(transacao.data), 'yyyy-MM-dd'),
      tipo: transacao.tipo,
      categoria: transacao.categoriaId,
      conta: transacao.contaId,
      observacao: transacao.observacao || ''
    });
    setShowModal(true);
  }, []);

  /**
   * Limpa o formulário e abre o modal para adicionar uma nova transação
   */
  const handleAdd = useCallback(() => {
    setEditingId(null);
    setFormData({
      descricao: '',
      valor: '',
      data: format(new Date(), 'yyyy-MM-dd'),
      tipo: 'DESPESA',
      categoria: '',
      conta: '',
      observacao: ''
    });
    setShowModal(true);
  }, []);

  /**
   * Salva a transação (adiciona nova ou atualiza existente)
   */
  const handleSave = useCallback(async () => {
    try {
      const transacaoData = {
        ...formData,
        valor: parseFloat(formData.valor),
        categoriaId: formData.categoria,
        contaId: formData.conta
      };
      
      if (editingId) {
        await TransacoesServices.updateTransacao(editingId, transacaoData);
      } else {
        await TransacoesServices.addTransacao(transacaoData);
      }
      
      await fetchData();
      setShowModal(false);
    } catch (err) {
      setError('Erro ao salvar transação. Por favor, tente novamente.');
      console.error(err);
    }
  }, [formData, editingId, fetchData]);

  /**
   * Remove uma transação existente
   */
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await TransacoesServices.deleteTransacao(id);
        await fetchData();
      } catch (err) {
        setError('Erro ao excluir transação. Por favor, tente novamente.');
        console.error(err);
      }
    }
  }, [fetchData]);

  /**
   * Atualiza os filtros de pesquisa
   */
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFiltro(prev => ({ ...prev, [name]: value }));
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
    transacoes: transacoesFiltradas(),
    contas,
    categorias,
    formData,
    isLoading,
    error,
    showModal,
    filtro,
    editingId,
    handleChange,
    handleFilterChange,
    handleEdit,
    handleAdd,
    handleSave,
    handleDelete,
    setShowModal,
    formatCurrency,
    formatDate
  };
};

export default { useTransacoes }; 