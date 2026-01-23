import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { homeServices } from '../services/HomeServices';

export function useHomeUtils() {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState({
    saldoTotal: 0,
    receitasMes: 0,
    despesasMes: 0,
    transacoesRecentes: [],
  });
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(new Date());
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const [contas, setContas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [financiamentos, setFinanciamentos] = useState([]);
  const [metas, setMetas] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [parcelamentos, setParcelamentos] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        contasData,
        despesasData,
        estoqueData,
        financiamentosData,
        metasData,
        orcamentosData,
        parcelamentosData,
        transacoesData,
        categoriasData,
      ] = await Promise.all([
        homeServices.getContas(),
        homeServices.getDespesas(),
        homeServices.getEstoque(),
        homeServices.getFinanciamentos(),
        homeServices.getMetas(),
        homeServices.getOrcamentos(),
        homeServices.getParcelamentos(),
        homeServices.getTransacoes(),
        homeServices.getCategorias(),
      ]);

      setContas(contasData);
      setDespesas(despesasData);
      setEstoque(estoqueData);
      setFinanciamentos(financiamentosData);
      setMetas(metasData);
      setOrcamentos(orcamentosData);
      setParcelamentos(parcelamentosData);
      setTransacoes(transacoesData);
      setCategorias(categoriasData);

      const saldoTotal = (contasData || []).reduce((acc, conta) => acc + (Number(conta.saldo) || 0), 0);
      const receitasMes = (transacoesData || [])
        .filter((t) => t.tipo === 'receita')
        .reduce((acc, t) => acc + (Number(t.valor) || 0), 0);
      const despesasMes = (transacoesData || [])
        .filter((t) => t.tipo === 'despesa')
        .reduce((acc, t) => acc + (Number(t.valor) || 0), 0);
      const transacoesRecentes = (transacoesData || []).slice(0, 5);

      setResumo({
        saldoTotal,
        receitasMes,
        despesasMes,
        transacoesRecentes,
      });

      const computedReportData = {
        resumoFinanceiro: {
          receita_total: receitasMes,
          despesa_total: despesasMes,
          saldo_total: saldoTotal,
        },
        progressoMetas: (metasData || []).map((meta) => ({
          descricao: meta.descricao,
          valor_atual: meta.valor_atual,
          valor_alvo: meta.valor_alvo,
        })),
        desempenhoOrcamentos: (orcamentosData || []).map((orcamento) => ({
          categoria:
            (categoriasData || []).find((c) => c._id === orcamento.categoria)?.nome ||
            'Desconhecida',
          valor_planejado: orcamento.valor_planejado,
          valor_atual: (despesasData || [])
            .filter((d) => d.categoria === orcamento.categoria)
            .reduce((acc, d) => acc + (Number(d.valor) || 0), 0),
        })),
      };

      setReportData(computedReportData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      showAlert('Erro ao buscar dados', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [fetchData, navigate]);

  const handleOpenReport = useCallback(() => {
    setShowReportModal(true);
  }, []);

  const handleCloseReport = useCallback(() => {
    setShowReportModal(false);
  }, []);

  const fluxoCaixaData = useMemo(() => {
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const receitas = new Array(12).fill(0).map((_, i) =>
      (transacoes || [])
        .filter((t) => t.tipo === 'receita' && new Date(t.data).getMonth() === i)
        .reduce((acc, t) => acc + (Number(t.valor) || 0), 0)
    );

    const despesasArr = new Array(12).fill(0).map((_, i) =>
      (transacoes || [])
        .filter((t) => t.tipo === 'despesa' && new Date(t.data).getMonth() === i)
        .reduce((acc, t) => acc + (Number(t.valor) || 0), 0)
    );

    return {
      labels,
      datasets: [
        {
          label: 'Receitas',
          data: receitas,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Despesas',
          data: despesasArr,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  }, [transacoes]);

  const categoriasData = useMemo(() => {
    return {
      labels: (categorias || []).map((categoria) => categoria.nome),
      datasets: [
        {
          data: (categorias || []).map((categoria) =>
            (despesas || [])
              .filter((despesa) => despesa.categoria === categoria._id)
              .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0)
          ),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
        },
      ],
    };
  }, [categorias, despesas]);

  const metasData = useMemo(() => {
    return {
      labels: (metas || []).map((meta) => meta.descricao),
      datasets: [
        {
          label: 'Progresso',
          data: (metas || []).map((meta) => (Number(meta.valor_atual) / Number(meta.valor_alvo)) * 100),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }, [metas]);

  const estoqueData = useMemo(() => {
    return {
      labels: (estoque || []).map((item) => item.nome),
      datasets: [
        {
          label: 'Quantidade em Estoque',
          data: (estoque || []).map((item) => Number(item.quantidade) || 0),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    };
  }, [estoque]);

  return {
    resumo,
    startDate,
    endDate,
    showReportModal,
    reportData,
    isLoading,
    alert,
    clearAlert,
    contas,
    despesas,
    estoque,
    financiamentos,
    metas,
    orcamentos,
    parcelamentos,
    transacoes,
    categorias,
    setStartDate,
    setEndDate,
    fetchData,
    handleOpenReport,
    handleCloseReport,
    fluxoCaixaData,
    categoriasData,
    metasData,
    estoqueData,
  };
}
