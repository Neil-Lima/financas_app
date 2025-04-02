import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ParcelamentosServices from '../services/ParcelamentosServices';

/**
 * Hook para gerenciamento de parcelamentos
 */
export const useParcelamentos = () => {
  const [parcelamentos, setParcelamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    descricao: '',
    valor_total: '',
    data_inicio: format(new Date(), 'yyyy-MM-dd'),
    num_parcelas: '',
    categoria: '',
    juros: '0',
    observacoes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [parcelasCalculadas, setParcelasCalculadas] = useState([]);
  const [detailsParcelamento, setDetailsParcelamento] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  /**
   * Busca todos os parcelamentos e categorias
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [parcelamentosRes, categoriasRes] = await Promise.all([
        ParcelamentosServices.fetchParcelamentos(),
        ParcelamentosServices.fetchCategorias()
      ]);
      
      setParcelamentos(parcelamentosRes.data);
      setCategorias(categoriasRes.data);
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
    } else if (name === 'valor_total' || name === 'juros') {
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
   * Abre o modal para edição de um parcelamento existente
   */
  const handleEdit = useCallback((parcelamento) => {
    setEditingId(parcelamento.id);
    setFormData({
      descricao: parcelamento.descricao,
      valor_total: parcelamento.valor_total.toString(),
      data_inicio: format(new Date(parcelamento.data_inicio), 'yyyy-MM-dd'),
      num_parcelas: parcelamento.num_parcelas.toString(),
      categoria: parcelamento.categoriaId,
      juros: parcelamento.juros ? parcelamento.juros.toString() : '0',
      observacoes: parcelamento.observacoes || ''
    });
    setShowModal(true);
  }, []);

  /**
   * Limpa o formulário e abre o modal para adicionar um novo parcelamento
   */
  const handleAdd = useCallback(() => {
    setEditingId(null);
    setFormData({
      descricao: '',
      valor_total: '',
      data_inicio: format(new Date(), 'yyyy-MM-dd'),
      num_parcelas: '',
      categoria: '',
      juros: '0',
      observacoes: ''
    });
    setShowModal(true);
  }, []);

  /**
   * Calcula as parcelas com base nos dados do formulário
   */
  const calcularParcelas = useCallback(async () => {
    try {
      if (!formData.valor_total || !formData.num_parcelas) {
        showAlert('Informe o valor total e número de parcelas', 'warning');
        return;
      }

      const parcelamentoData = {
        valor_total: parseFloat(formData.valor_total),
        num_parcelas: parseInt(formData.num_parcelas),
        data_inicio: formData.data_inicio,
        juros: parseFloat(formData.juros) || 0
      };

      const response = await ParcelamentosServices.calcularParcelas(parcelamentoData);
      setParcelasCalculadas(response.data);
    } catch (err) {
      setError('Erro ao calcular parcelas. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao calcular parcelas', 'danger');
    }
  }, [formData, showAlert]);

  /**
   * Salva o parcelamento (adiciona novo ou atualiza existente)
   */
  const handleSave = useCallback(async () => {
    try {
      if (!formData.valor_total || !formData.num_parcelas || !formData.descricao || !formData.categoria) {
        showAlert('Preencha todos os campos obrigatórios', 'warning');
        return;
      }

      const parcelamentoData = {
        ...formData,
        valor_total: parseFloat(formData.valor_total),
        num_parcelas: parseInt(formData.num_parcelas),
        juros: parseFloat(formData.juros) || 0,
        categoriaId: formData.categoria
      };
      
      if (editingId) {
        await ParcelamentosServices.updateParcelamento(editingId, parcelamentoData);
        showAlert('Parcelamento atualizado com sucesso', 'success');
      } else {
        await ParcelamentosServices.addParcelamento(parcelamentoData);
        showAlert('Parcelamento adicionado com sucesso', 'success');
      }
      
      await fetchData();
      setShowModal(false);
    } catch (err) {
      setError('Erro ao salvar parcelamento. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao salvar parcelamento', 'danger');
    }
  }, [formData, editingId, fetchData, showAlert]);

  /**
   * Remove um parcelamento existente
   */
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este parcelamento?')) {
      try {
        await ParcelamentosServices.deleteParcelamento(id);
        await fetchData();
        showAlert('Parcelamento excluído com sucesso', 'success');
      } catch (err) {
        setError('Erro ao excluir parcelamento. Por favor, tente novamente.');
        console.error(err);
        showAlert('Erro ao excluir parcelamento', 'danger');
      }
    }
  }, [fetchData, showAlert]);

  /**
   * Abre o modal de detalhes para um parcelamento
   */
  const handleShowDetails = useCallback((parcelamento) => {
    setDetailsParcelamento(parcelamento);
    setShowDetailsModal(true);
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

  /**
   * Calcula o valor da parcela sem juros
   */
  const calcularValorParcela = useCallback((valorTotal, numParcelas) => {
    return valorTotal / numParcelas;
  }, []);

  /**
   * Calcula o valor total com juros
   */
  const calcularTotalComJuros = useCallback((valorTotal, taxaJuros, numParcelas) => {
    if (taxaJuros === 0) return valorTotal;
    const taxaDecimal = taxaJuros / 100;
    return valorTotal * Math.pow(1 + taxaDecimal, numParcelas);
  }, []);

  // Carrega os dados ao iniciar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    parcelamentos,
    categorias,
    formData,
    isLoading,
    error,
    showModal,
    showDetailsModal,
    parcelasCalculadas,
    detailsParcelamento,
    alert,
    editingId,
    handleChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSave,
    calcularParcelas,
    handleShowDetails,
    setShowModal,
    setShowDetailsModal,
    formatCurrency,
    formatDate,
    calcularValorParcela,
    calcularTotalComJuros,
    showAlert
  };
};

export const ParcelamentosUtils = {
  useParcelamentos
}; 