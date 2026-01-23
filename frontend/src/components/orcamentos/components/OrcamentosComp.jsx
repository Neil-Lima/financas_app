import React, { useMemo, useState } from 'react';
import {
  Alert,
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
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Paper,
  TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Assessment as AssessmentIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faEye, faPlus, faQuestionCircle, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useOrcamentosUtils } from '../utils/OrcamentosUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, ChartTooltip, Legend);

export default function OrcamentosComp() {
  const {
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
    setEditingId,
    chartData,
  } = useOrcamentosUtils();

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: '#ffffff' } },
        title: { display: true, text: 'Orçamento Planejado vs Atual', color: '#ffffff' },
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#ffffff' } },
        x: { ticks: { color: '#ffffff' } },
      },
    }),
    []
  );

  const labels = Array.isArray(chartData?.labels) ? chartData.labels : [];

  const plannedByCategoryData = useMemo(() => {
    const planned = Array.isArray(chartData?.datasets?.[0]?.data) ? chartData.datasets[0].data : [];
    return {
      labels,
      datasets: [
        {
          label: 'Planejado',
          data: planned,
          backgroundColor: [
            'rgba(79, 70, 229, 0.75)',
            'rgba(59, 130, 246, 0.75)',
            'rgba(16, 185, 129, 0.75)',
            'rgba(245, 158, 11, 0.75)',
            'rgba(239, 68, 68, 0.75)',
            'rgba(147, 51, 234, 0.75)',
            'rgba(20, 184, 166, 0.75)',
            'rgba(236, 72, 153, 0.75)',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [chartData, labels]);

  const restanteByCategoryData = useMemo(() => {
    const safe = Array.isArray(orcamentos) ? orcamentos : [];
    return {
      labels: safe.map((o) => (typeof o.categoria === 'object' ? o.categoria?.nome : String(o.categoria))),
      datasets: [
        {
          label: 'Restante',
          data: safe.map((o) => Number(o.valor_restante) || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
        },
      ],
    };
  }, [orcamentos]);

  const getCategoriaNome = (orcamento) => {
    if (!orcamento) return '';
    if (typeof orcamento.categoria === 'object' && orcamento.categoria) return orcamento.categoria.nome;
    return categorias.find((c) => c._id === orcamento.categoria)?.nome || '';
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      {alert.show && (
        <Alert severity={alert.variant === 'danger' ? 'error' : alert.variant} onClose={clearAlert} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

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
                <AssessmentIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Orçamentos</Typography>
                <Typography variant="body2" color="text.secondary">
                  Planeje limites por categoria e acompanhe o desempenho
                </Typography>
              </Box>
              <Chip label={`${Array.isArray(orcamentos) ? orcamentos.length : 0} itens`} variant="outlined" />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
              <Button variant="contained" onClick={() => setOpenCreateModal(true)} startIcon={<FontAwesomeIcon icon={faPlus} />}>
                Novo Orçamento
              </Button>
              <Button variant="outlined" onClick={() => setShowInstructionsModal(true)} startIcon={<FontAwesomeIcon icon={faQuestionCircle} />}>
                Instruções
              </Button>
              <Button variant="outlined" onClick={handleCompararAnual}>
                Comparar com Ano Anterior
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
            Alertas de Ultrapassagem de Limites:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {alerts.map((a, index) => (
              <Box component="li" key={index}>
                {a}
              </Box>
            ))}
          </Box>
        </Alert>
      )}

      <Card
        sx={{
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
        <CardHeader title="Lista de Orçamentos" />
        <Divider />
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Planejado</TableCell>
                  <TableCell>Atual</TableCell>
                  <TableCell>Restante</TableCell>
                  <TableCell>Progresso</TableCell>
                  <TableCell>Recorrência</TableCell>
                  <TableCell>Prioridade</TableCell>
                  <TableCell>Meta de Economia</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orcamentos.map((orcamento) => {
                  const isEditing = editingId === orcamento._id;
                  const planned = Number(orcamento.valor_planejado || 0);
                  const current = Number(orcamento.valor_atual || 0);
                  const progress = planned > 0 ? (current / planned) * 100 : 0;
                  const progressColor = current > planned ? 'error' : 'success';

                  return (
                    <TableRow key={orcamento._id} hover>
                      <TableCell sx={{ minWidth: 200 }}>
                        {isEditing ? (
                          <TextField select size="small" name="categoria" value={editedOrcamento.categoria} onChange={handleEditChange} fullWidth>
                            {categorias.map((categoria) => (
                              <MenuItem key={categoria._id} value={categoria._id}>
                                {categoria.nome}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          getCategoriaNome(orcamento)
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 140 }}>
                        {isEditing ? (
                          <TextField
                            size="small"
                            type="number"
                            name="valor_planejado"
                            value={editedOrcamento.valor_planejado}
                            onChange={handleEditChange}
                            fullWidth
                          />
                        ) : (
                          `R$ ${planned.toFixed(2)}`
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 120 }}>R$ {Number(orcamento.valor_atual || 0).toFixed(2)}</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>R$ {Number(orcamento.valor_restante || 0).toFixed(2)}</TableCell>

                      <TableCell sx={{ minWidth: 200 }}>
                        <Stack spacing={0.75}>
                          <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, progress))} color={progressColor} />
                          <Typography variant="caption" color="text.secondary">
                            {Math.max(0, progress).toFixed(0)}%
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ minWidth: 140 }}>{orcamento.recorrencia}</TableCell>
                      <TableCell sx={{ minWidth: 110 }}>{orcamento.prioridade}</TableCell>
                      <TableCell sx={{ minWidth: 150 }}>R$ {Number(orcamento.metaEconomia || 0).toFixed(2)}</TableCell>

                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        {isEditing ? (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Salvar">
                              <IconButton
                                aria-label={`salvar orcamento ${String(getCategoriaNome(editedOrcamento) || editedOrcamento?.categoria || '').trim()}`.trim()}
                                color="success"
                                onClick={handleSaveEdit}
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancelar">
                              <IconButton aria-label="cancelar edicao orcamento" color="inherit" onClick={() => setEditingId(null)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Editar">
                              <IconButton
                                aria-label={`editar orcamento ${String(getCategoriaNome(orcamento) || '').trim()}`.trim()}
                                onClick={() => handleEdit(orcamento)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <IconButton
                                aria-label={`excluir orcamento ${String(getCategoriaNome(orcamento) || '').trim()}`.trim()}
                                color="error"
                                onClick={() => handleDelete(orcamento._id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Detalhes">
                              <IconButton
                                aria-label={`detalhes orcamento ${String(getCategoriaNome(orcamento) || '').trim()}`.trim()}
                                color="info"
                                onClick={() => handleShowDetails(orcamento)}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {comparacaoAnual && (
        <Card
          sx={{
            mt: 2.5,
            overflow: 'hidden',
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.16)} 0%, ${alpha(
                theme.palette.background.paper,
                0.12
              )} 70%)`,
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.secondary.main, 0.16),
          }}
        >
          <CardHeader title="Comparação Anual" />
          <Divider />
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Ano Anterior</TableCell>
                    <TableCell>Ano Atual</TableCell>
                    <TableCell>Diferença</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(comparacaoAnual).map(([categoria, { anterior, atual }]) => (
                    <TableRow key={categoria} hover>
                      <TableCell>{categoria}</TableCell>
                      <TableCell>R$ {Number(anterior || 0).toFixed(2)}</TableCell>
                      <TableCell>R$ {Number(atual || 0).toFixed(2)}</TableCell>
                      <TableCell>R$ {(Number(atual || 0) - Number(anterior || 0)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2.5} sx={{ mt: 2.5 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.12
                )} 70%)`,
            }}
          >
            <CardHeader title="Planejado vs Atual" />
            <Divider />
            <CardContent sx={{ height: { xs: 240, md: 260 } }}>
              <Box sx={{ height: '100%' }}>
                <Bar data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.14)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.12
                )} 70%)`,
            }}
          >
            <CardHeader title="Distribuição do Planejado" />
            <Divider />
            <CardContent sx={{ height: { xs: 240, md: 260 } }}>
              <Box sx={{ height: '100%' }}>
                <Doughnut data={plannedByCategoryData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.14)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.12
                )} 70%)`,
            }}
          >
            <CardHeader title="Restante por Categoria" />
            <Divider />
            <CardContent sx={{ height: { xs: 240, md: 260 } }}>
              <Box sx={{ height: '100%' }}>
                <Bar
                  data={restanteByCategoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Novo Orçamento</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Categoria"
                  name="categoria"
                  value={newOrcamento.categoria}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="">Selecione uma categoria</MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria._id} value={categoria._id}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Valor Planejado"
                  type="number"
                  name="valor_planejado"
                  value={newOrcamento.valor_planejado}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Mês"
                  type="number"
                  name="mes"
                  value={newOrcamento.mes}
                  onChange={handleInputChange}
                  inputProps={{ min: 1, max: 12 }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Ano"
                  type="number"
                  name="ano"
                  value={newOrcamento.ano}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Notas"
                  name="notas"
                  value={newOrcamento.notas}
                  onChange={handleInputChange}
                  multiline
                  minRows={3}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField select fullWidth label="Recorrência" name="recorrencia" value={newOrcamento.recorrencia} onChange={handleInputChange}>
                  <MenuItem value="nao_recorrente">Não Recorrente</MenuItem>
                  <MenuItem value="mensal">Mensal</MenuItem>
                  <MenuItem value="trimestral">Trimestral</MenuItem>
                  <MenuItem value="anual">Anual</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Prioridade"
                  type="number"
                  name="prioridade"
                  value={newOrcamento.prioridade}
                  onChange={handleInputChange}
                  inputProps={{ min: 1, max: 5 }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Meta de Economia"
                  type="number"
                  name="metaEconomia"
                  value={newOrcamento.metaEconomia}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <DialogActions sx={{ px: 0, pt: 3 }}>
              <Button variant="text" onClick={() => setOpenCreateModal(false)}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit" startIcon={<FontAwesomeIcon icon={faPlus} />}>
                Adicionar Orçamento
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsModal} onClose={handleHideDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Orçamento</DialogTitle>
        <DialogContent>
          {detailsOrcamento && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              <Typography><strong>Categoria:</strong> {getCategoriaNome(detailsOrcamento)}</Typography>
              <Typography>
                <strong>Valor Planejado:</strong> R$ {Number(detailsOrcamento.valor_planejado || 0).toFixed(2)}
              </Typography>
              <Typography>
                <strong>Valor Atual:</strong> R$ {Number(detailsOrcamento.valor_atual || 0).toFixed(2)}
              </Typography>
              <Typography>
                <strong>Valor Restante:</strong> R$ {Number(detailsOrcamento.valor_restante || 0).toFixed(2)}
              </Typography>
              <Typography><strong>Mês:</strong> {detailsOrcamento.mes}</Typography>
              <Typography><strong>Ano:</strong> {detailsOrcamento.ano}</Typography>
              <Typography><strong>Notas:</strong> {detailsOrcamento.notas}</Typography>
              <Typography><strong>Recorrência:</strong> {detailsOrcamento.recorrencia}</Typography>
              <Typography><strong>Prioridade:</strong> {detailsOrcamento.prioridade}</Typography>
              <Typography>
                <strong>Meta de Economia:</strong> R$ {Number(detailsOrcamento.metaEconomia || 0).toFixed(2)}
              </Typography>
              <Typography><strong>ID:</strong> {detailsOrcamento._id}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHideDetails}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showInstructionsModal} onClose={() => setShowInstructionsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Instruções</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              Como usar a página de Orçamentos:
            </Typography>
            <Box component="ol" sx={{ m: 0, pl: 2, mb: 2 }}>
              <Box component="li">Adicione um novo orçamento clicando em "Novo Orçamento".</Box>
              <Box component="li">Visualize seus orçamentos no gráfico e na tabela.</Box>
              <Box component="li">Edite ou exclua orçamentos existentes usando os botões na tabela.</Box>
              <Box component="li">Compare com o ano anterior usando "Comparar com Ano Anterior".</Box>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              Descrição dos campos:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <Box component="li"><strong>Categoria:</strong> A categoria do orçamento.</Box>
              <Box component="li"><strong>Valor Planejado:</strong> O valor que você planeja gastar.</Box>
              <Box component="li"><strong>Valor Atual:</strong> O valor que você já gastou.</Box>
              <Box component="li"><strong>Valor Restante:</strong> A diferença entre o planejado e o atual.</Box>
              <Box component="li"><strong>Recorrência:</strong> Se o orçamento se repete e com que frequência.</Box>
              <Box component="li"><strong>Prioridade:</strong> A importância do orçamento (1-5).</Box>
              <Box component="li"><strong>Meta de Economia:</strong> Quanto você pretende economizar nesta categoria.</Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInstructionsModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
