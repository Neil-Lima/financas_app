import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Summarize as SummarizeIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useRelatoriosUtils } from '../utils/RelatoriosUtils';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function RelatoriosComp() {
  const { dataInicial, dataFinal, relatorio, handleInputChange, handleSubmit, handleDownloadPDF } = useRelatoriosUtils();
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const renderResumoFinanceiro = () => {
    if (!relatorio?.resumoFinanceiro) return null;
    const { receita_total, despesa_total, saldo_total } = relatorio.resumoFinanceiro;
    return (
      <Card
        sx={{
          mb: 2.5,
          overflow: 'hidden',
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(
              theme.palette.background.paper,
              0.12
            )} 70%)`,
        }}
      >
        <CardHeader title="Resumo Financeiro" />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Receita Total
              </Typography>
              <Typography variant="h6" color="success.main">
                R$ {receita_total.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Despesa Total
              </Typography>
              <Typography variant="h6" color="error.main">
                R$ {despesa_total.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Saldo Total
              </Typography>
              <Typography variant="h6" color={saldo_total >= 0 ? 'success.main' : 'error.main'}>
                R$ {saldo_total.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderTransacoesPorCategoria = () => {
    if (!relatorio?.transacoesPorCategoria) return null;
    const data = {
      labels: relatorio.transacoesPorCategoria.map((item) => item.categoria),
      datasets: [
        {
          data: relatorio.transacoesPorCategoria.map((item) => item.total),
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
    return (
      <Card
        sx={{
          mb: 2.5,
          overflow: 'hidden',
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.14)} 0%, ${alpha(
              theme.palette.background.paper,
              0.12
            )} 70%)`,
        }}
      >
        <CardHeader title="Transações por Categoria" />
        <Divider />
        <CardContent sx={{ height: { xs: 260, md: 320 } }}>
          <Box sx={{ height: '100%' }}>
            <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderFluxoCaixa = () => {
    if (!relatorio?.fluxoCaixa) return null;
    const data = {
      labels: relatorio.fluxoCaixa.map((item) => item.mes),
      datasets: [
        {
          label: 'Receitas',
          data: relatorio.fluxoCaixa.map((item) => item.receitas),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Despesas',
          data: relatorio.fluxoCaixa.map((item) => item.despesas),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
    return (
      <Card
        sx={{
          mb: 2.5,
          overflow: 'hidden',
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(
              theme.palette.background.paper,
              0.12
            )} 70%)`,
        }}
      >
        <CardHeader title="Fluxo de Caixa" />
        <Divider />
        <CardContent sx={{ height: { xs: 260, md: 320 } }}>
          <Box sx={{ height: '100%' }}>
            <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderProgressoMetas = () => {
    if (!relatorio?.progressoMetas) return null;
    return (
      <Card
        sx={{
          mb: 2.5,
          overflow: 'hidden',
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.22)} 0%, ${alpha(
              theme.palette.info.main,
              0.14
            )} 40%, ${alpha(theme.palette.background.paper, 0.08)} 100%)`,
          border: '1px solid',
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.18),
          boxShadow: (theme) => `0 10px 30px ${alpha(theme.palette.common.black, 0.22)}`,
        }}
      >
        <CardHeader title="Progresso das Metas" />
        <Divider />
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
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
                {relatorio.progressoMetas.map((meta, index) => {
                  const percent = (Number(meta.valor_atual || 0) / Number(meta.valor_alvo || 1)) * 100;
                  return (
                    <TableRow key={index} hover>
                      <TableCell>{meta.descricao}</TableCell>
                      <TableCell>R$ {Number(meta.valor_atual || 0).toFixed(2)}</TableCell>
                      <TableCell>R$ {Number(meta.valor_alvo || 0).toFixed(2)}</TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        <Stack spacing={0.75}>
                          <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, percent))} />
                          <Typography variant="caption" color="text.secondary">
                            {Math.max(0, percent).toFixed(0)}%
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  const renderDesempenhoOrcamentos = () => {
    if (!relatorio?.desempenhoOrcamentos) return null;
    const data = {
      labels: relatorio.desempenhoOrcamentos.map((item) => item.categoria),
      datasets: [
        {
          label: 'Valor Planejado',
          data: relatorio.desempenhoOrcamentos.map((item) => item.valor_planejado),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Valor Atual',
          data: relatorio.desempenhoOrcamentos.map((item) => item.valor_atual),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };
    return (
      <Card
        sx={{
          mb: 2.5,
          overflow: 'hidden',
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(
              theme.palette.background.paper,
              0.12
            )} 70%)`,
        }}
      >
        <CardHeader title="Desempenho dos Orçamentos" />
        <Divider />
        <CardContent sx={{ height: { xs: 260, md: 320 } }}>
          <Box sx={{ height: '100%' }}>
            <Bar
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Card
        sx={{
          mb: 3,
          overflow: 'hidden',
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(
              theme.palette.info.main,
              0.12
            )} 45%, ${alpha(theme.palette.background.paper, 0.2)} 100%)`,
        }}
      >
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18),
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <SummarizeIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Relatórios Financeiros</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gere relatórios por período e baixe em PDF
                </Typography>
              </Box>
              <Chip label={relatorio ? 'gerado' : 'vazio'} variant="outlined" />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="contained" onClick={() => setOpenFilterModal(true)} startIcon={<FontAwesomeIcon icon={faSearch} />}>
                Gerar Relatório
              </Button>
              <Button variant="outlined" onClick={handleDownloadPDF} startIcon={<FontAwesomeIcon icon={faFileDownload} />} disabled={!dataInicial || !dataFinal}>
                Baixar PDF
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {relatorio && (
        <>
          {renderResumoFinanceiro()}
          {renderTransacoesPorCategoria()}
          {renderFluxoCaixa()}
          {renderProgressoMetas()}
          {renderDesempenhoOrcamentos()}
        </>
      )}

      <Dialog open={openFilterModal} onClose={() => setOpenFilterModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gerar Relatório</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={async (e) => {
              await handleSubmit(e);
              setOpenFilterModal(false);
            }}
            sx={{ pt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data Inicial"
                  type="date"
                  name="dataInicial"
                  value={dataInicial}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data Final"
                  type="date"
                  name="dataFinal"
                  value={dataFinal}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>

            <DialogActions sx={{ px: 0, pt: 3 }}>
              <Button variant="text" onClick={() => setOpenFilterModal(false)}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit" startIcon={<FontAwesomeIcon icon={faSearch} />}>
                Gerar Relatório
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
