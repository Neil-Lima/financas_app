import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  LinearProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faExchangeAlt,
  faFileAlt,
  faMoneyBillWave,
  faSync,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  ChartContainer,
  IconWrapper,
  StyledContainer,
  StyledDatePicker,
} from '../styles/HomeStyles';
import { useHomeUtils } from '../utils/HomeUtils';
import { contasServices } from '../../contas/services/ContasServices';

export default function HomeComp({ onBalanceChanged }) {
  const {
    resumo,
    startDate,
    endDate,
    showReportModal,
    reportData,
    isLoading,
    alert,
    clearAlert,
    setStartDate,
    setEndDate,
    fetchData,
    handleOpenReport,
    handleCloseReport,
    fluxoCaixaData,
    categoriasData,
    metasData,
    estoqueData,
  } = useHomeUtils();

  const [openSaldoModal, setOpenSaldoModal] = React.useState(false);
  const [saldoForm, setSaldoForm] = React.useState({ nome: '', saldo: '', tipo: 'corrente', data: '' });
  const [savingSaldo, setSavingSaldo] = React.useState(false);

  const handleSaldoInputChange = (e) => {
    const { name, value } = e.target;
    setSaldoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenSaldoModal = () => {
    setOpenSaldoModal(true);
  };

  const handleCloseSaldoModal = () => {
    setOpenSaldoModal(false);
  };

  const handleSaveSaldo = async (e) => {
    e.preventDefault();
    if (savingSaldo) return;
    setSavingSaldo(true);
    try {
      const payload = {
        ...saldoForm,
        saldo: Number(saldoForm.saldo),
        data: saldoForm.data ? new Date(saldoForm.data).toISOString() : null,
      };
      await contasServices.createConta(payload);
      setSaldoForm({ nome: '', saldo: '', tipo: 'corrente', data: '' });
      handleCloseSaldoModal();
      await fetchData();
      if (typeof onBalanceChanged === 'function') {
        await onBalanceChanged();
      }
    } finally {
      setSavingSaldo(false);
    }
  };

  const formatCurrency = (value) => {
    const numeric = Number(value) || 0;
    return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const categoriasTotals = Array.isArray(categoriasData?.datasets?.[0]?.data)
    ? categoriasData.datasets[0].data.map((v) => Number(v) || 0)
    : [];

  const categoriasLabels = Array.isArray(categoriasData?.labels) ? categoriasData.labels : [];

  const totalDespesasCategoria = categoriasTotals.reduce((acc, v) => acc + v, 0);

  const despesasCategoriaTop = categoriasLabels
    .map((label, idx) => ({
      label,
      value: categoriasTotals[idx] || 0,
    }))
    .filter((i) => i.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const categoriaColors = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#22c55e',
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#94a3b8',
    '#14b8a6',
    '#a3e635',
  ];

  const categoriasChartData = {
    labels: categoriasLabels,
    datasets: [
      {
        ...(categoriasData?.datasets?.[0] || {}),
        data: categoriasTotals,
        backgroundColor: categoriasLabels.map((_, idx) => categoriaColors[idx % categoriaColors.length]),
        borderColor: 'rgba(15, 23, 42, 0.9)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <StyledContainer>
      {alert.show && (
        <Box sx={{ mb: 2 }}>
          <Alert severity={alert.variant === 'danger' ? 'error' : alert.variant} onClose={clearAlert}>
            {alert.message}
          </Alert>
        </Box>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md="auto">
              <Typography variant="h4">Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                Visão geral financeira, metas e estoque
              </Typography>
            </Grid>

            <Grid item xs={12} md>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Button variant="outlined" onClick={handleOpenSaldoModal}>
                  Definir Saldo Inicial
                </Button>
                <StyledDatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
                <StyledDatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
                <Button variant="contained" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? (
                    <CircularProgress size={18} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSync} style={{ marginRight: 8 }} /> Atualizar Dados
                    </>
                  )}
                </Button>
                <Button variant="outlined" onClick={handleOpenReport}>
                  <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: 8 }} /> Relatório Completo
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={openSaldoModal} onClose={handleCloseSaldoModal} fullWidth maxWidth="sm">
        <DialogTitle>Saldo Inicial</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSaveSaldo} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome da Conta"
                  name="nome"
                  value={saldoForm.nome}
                  onChange={handleSaldoInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Saldo"
                  name="saldo"
                  type="number"
                  value={saldoForm.saldo}
                  onChange={handleSaldoInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Tipo"
                  name="tipo"
                  value={saldoForm.tipo}
                  onChange={handleSaldoInputChange}
                  required
                >
                  <MenuItem value="corrente">Corrente</MenuItem>
                  <MenuItem value="poupança">Poupança</MenuItem>
                  <MenuItem value="investimento">Investimento</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data"
                  type="date"
                  name="data"
                  value={saldoForm.data}
                  onChange={handleSaldoInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
            <DialogActions sx={{ px: 0, pt: 3 }}>
              <Button onClick={handleCloseSaldoModal} disabled={savingSaldo}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={savingSaldo}>
                {savingSaldo ? <CircularProgress size={18} /> : 'Salvar'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Resumo Financeiro" />
        <Divider />
        <CardContent>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6} md={3}>
              <IconWrapper>
                <FontAwesomeIcon icon={faWallet} />
              </IconWrapper>
              <Typography variant="subtitle2" color="text.secondary">Saldo Total</Typography>
              <Typography variant="h6" color={resumo.saldoTotal >= 0 ? 'success.main' : 'error.main'}>
                R$ {Number(resumo.saldoTotal || 0).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <IconWrapper>
                <FontAwesomeIcon icon={faChartLine} />
              </IconWrapper>
              <Typography variant="subtitle2" color="text.secondary">Receitas do Período</Typography>
              <Typography variant="h6" color="success.main">R$ {Number(resumo.receitasMes || 0).toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <IconWrapper>
                <FontAwesomeIcon icon={faExchangeAlt} />
              </IconWrapper>
              <Typography variant="subtitle2" color="text.secondary">Despesas do Período</Typography>
              <Typography variant="h6" color="error.main">R$ {Number(resumo.despesasMes || 0).toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <IconWrapper>
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </IconWrapper>
              <Typography variant="subtitle2" color="text.secondary">Saldo do Período</Typography>
              <Typography variant="h6" color={Number(resumo.receitasMes || 0) - Number(resumo.despesasMes || 0) >= 0 ? 'success.main' : 'error.main'}>
                R$ {(Number(resumo.receitasMes || 0) - Number(resumo.despesasMes || 0)).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Fluxo de Caixa" />
            <Divider />
            <CardContent>
              <ChartContainer>
                <Line data={fluxoCaixaData} options={{ responsive: true, maintainAspectRatio: false }} />
              </ChartContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Despesas por Categoria"
              subheader={
                totalDespesasCategoria > 0
                  ? `${formatCurrency(totalDespesasCategoria)} no período`
                  : 'Sem despesas no período'
              }
            />
            <Divider />
            <CardContent>
              {totalDespesasCategoria > 0 ? (
                <Grid container spacing={2.5} alignItems="stretch">
                  <Grid item xs={12} md={7}>
                    <ChartContainer style={{ height: 260, marginBottom: 0 }}>
                      <Doughnut
                        data={categoriasChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: '68%',
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                boxWidth: 10,
                                boxHeight: 10,
                                padding: 12,
                              },
                            },
                            tooltip: {
                              callbacks: {
                                label: (ctx) => {
                                  const value = Number(ctx.raw) || 0;
                                  const pct = totalDespesasCategoria
                                    ? Math.round((value / totalDespesasCategoria) * 100)
                                    : 0;
                                  return `${ctx.label}: ${formatCurrency(value)} (${pct}%)`;
                                },
                              },
                            },
                          },
                        }}
                      />
                    </ChartContainer>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Stack spacing={1.25} sx={{ height: '100%', justifyContent: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Top categorias
                      </Typography>
                      {despesasCategoriaTop.map((item, idx) => {
                        const pct = totalDespesasCategoria
                          ? Math.round((item.value / totalDespesasCategoria) * 100)
                          : 0;
                        return (
                          <Box key={`${item.label}-${idx}`} sx={{ p: 1.25, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                                  {item.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatCurrency(item.value)} ({pct}%)
                                </Typography>
                              </Stack>
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  bgcolor: categoriaColors[idx % categoriaColors.length],
                                  flex: '0 0 auto',
                                }}
                              />
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={pct}
                              sx={{ mt: 1, height: 8, borderRadius: 999 }}
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma despesa encontrada para o período selecionado.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Progresso das Metas" />
            <Divider />
            <CardContent>
              <ChartContainer>
                <Bar data={metasData} options={{ responsive: true, maintainAspectRatio: false }} />
              </ChartContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Visão Geral do Estoque" />
            <Divider />
            <CardContent>
              <ChartContainer>
                <Bar data={estoqueData} options={{ responsive: true, maintainAspectRatio: false }} />
              </ChartContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Transações Recentes" />
        <Divider />
        <CardContent>
          <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 520 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Tipo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumo.transacoesRecentes?.length > 0 ? (
                  resumo.transacoesRecentes.map((transacao, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{new Date(transacao.data).toLocaleDateString()}</TableCell>
                      <TableCell>{transacao.descricao}</TableCell>
                      <TableCell sx={{ color: transacao.tipo === 'receita' ? 'success.main' : 'error.main', fontWeight: 700 }}>
                        R$ {Number(transacao.valor || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>{transacao.tipo}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhuma transação recente
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={showReportModal} onClose={handleCloseReport} fullWidth maxWidth="lg">
        <DialogTitle>Relatório Financeiro Completo</DialogTitle>
        <DialogContent dividers>
          {reportData ? (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>Resumo Financeiro</Typography>
              <Typography>Receita Total: R$ {Number(reportData.resumoFinanceiro.receita_total || 0).toFixed(2)}</Typography>
              <Typography>Despesa Total: R$ {Number(reportData.resumoFinanceiro.despesa_total || 0).toFixed(2)}</Typography>
              <Typography sx={{ mb: 2 }}>Saldo Total: R$ {Number(reportData.resumoFinanceiro.saldo_total || 0).toFixed(2)}</Typography>

              <Typography variant="h6" sx={{ mb: 1 }}>Progresso das Metas</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Valor Atual</TableCell>
                    <TableCell>Valor Alvo</TableCell>
                    <TableCell>Progresso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.progressoMetas.map((meta, index) => {
                    const pct = (Number(meta.valor_atual || 0) / Number(meta.valor_alvo || 1)) * 100;
                    return (
                      <TableRow key={index}>
                        <TableCell>{meta.descricao}</TableCell>
                        <TableCell>R$ {Number(meta.valor_atual || 0).toFixed(2)}</TableCell>
                        <TableCell>R$ {Number(meta.valor_alvo || 0).toFixed(2)}</TableCell>
                        <TableCell>{pct.toFixed(0)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Typography variant="h6" sx={{ mb: 1 }}>Desempenho dos Orçamentos</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Valor Planejado</TableCell>
                    <TableCell>Valor Atual</TableCell>
                    <TableCell>Diferença</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.desempenhoOrcamentos.map((orcamento, index) => (
                    <TableRow key={index}>
                      <TableCell>{orcamento.categoria}</TableCell>
                      <TableCell>R$ {Number(orcamento.valor_planejado || 0).toFixed(2)}</TableCell>
                      <TableCell>R$ {Number(orcamento.valor_atual || 0).toFixed(2)}</TableCell>
                      <TableCell sx={{ color: Number(orcamento.valor_atual || 0) <= Number(orcamento.valor_planejado || 0) ? 'success.main' : 'error.main' }}>
                        R$ {(Number(orcamento.valor_planejado || 0) - Number(orcamento.valor_atual || 0)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <Typography>Carregando dados do relatório...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReport}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
}
