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
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ReceiptLong as ReceiptLongIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faEye, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { useFinanciamentosUtils } from '../utils/FinanciamentosUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

export default function FinanciamentosComp() {
  const {
    financiamentos,
    newFinanciamento,
    editingId,
    editedFinanciamento,
    showDetailsModal,
    detailsFinanciamento,
    alert,
    clearAlert,
    chartData,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleHideDetails,
    setEditingId,
  } = useFinanciamentosUtils();

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { color: '#ffffff' } },
        x: { ticks: { color: '#ffffff' } },
      },
      plugins: {
        legend: { labels: { color: '#ffffff' } },
        title: { display: true, text: 'Valor Total dos Financiamentos', color: '#ffffff' },
      },
    }),
    []
  );

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString();
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
                <ReceiptLongIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Financiamentos</Typography>
                <Typography variant="body2" color="text.secondary">
                  Controle financiamentos e acompanhe valores
                </Typography>
              </Box>
              <Chip label={`${Array.isArray(financiamentos) ? financiamentos.length : 0} itens`} variant="outlined" />
            </Stack>

            <Button variant="contained" onClick={() => setOpenCreateModal(true)} startIcon={<FontAwesomeIcon icon={faPlus} />}>
              Novo Financiamento
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Card
            sx={{
              overflow: 'hidden',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.12
                )} 70%)`,
            }}
          >
            <CardHeader title="Visão Geral de Financiamentos" />
            <Divider />
            <CardContent sx={{ height: { xs: 260, md: 320 } }}>
              <Box sx={{ height: '100%' }}>
                <Bar data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
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
            <CardHeader title="Lista de Financiamentos" />
            <Divider />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor Total</TableCell>
                      <TableCell>Taxa de Juros</TableCell>
                      <TableCell>Parcelas Totais</TableCell>
                      <TableCell>Data de Início</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {financiamentos.map((financiamento) => {
                      const isEditing = editingId === financiamento._id;

                      return (
                        <TableRow key={financiamento._id} hover>
                          <TableCell sx={{ minWidth: 220 }}>
                            {isEditing ? (
                              <TextField size="small" name="descricao" value={editedFinanciamento.descricao} onChange={handleEditChange} fullWidth />
                            ) : (
                              financiamento.descricao
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 160 }}>
                            {isEditing ? (
                              <TextField
                                size="small"
                                type="number"
                                name="valor_total"
                                value={editedFinanciamento.valor_total}
                                onChange={handleEditChange}
                                fullWidth
                              />
                            ) : (
                              `R$ ${Number(financiamento.valor_total || 0).toFixed(2)}`
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 140 }}>
                            {isEditing ? (
                              <TextField
                                size="small"
                                type="number"
                                name="taxa_juros"
                                value={editedFinanciamento.taxa_juros}
                                onChange={handleEditChange}
                                fullWidth
                              />
                            ) : (
                              `${Number(financiamento.taxa_juros || 0)}%`
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 150 }}>
                            {isEditing ? (
                              <TextField
                                size="small"
                                type="number"
                                name="parcelas_totais"
                                value={editedFinanciamento.parcelas_totais}
                                onChange={handleEditChange}
                                fullWidth
                              />
                            ) : (
                              financiamento.parcelas_totais
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 170 }}>
                            {isEditing ? (
                              <TextField
                                size="small"
                                type="date"
                                name="data_inicio"
                                value={editedFinanciamento.data_inicio}
                                onChange={handleEditChange}
                                fullWidth
                              />
                            ) : (
                              formatDate(financiamento.data_inicio)
                            )}
                          </TableCell>

                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            {isEditing ? (
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Salvar">
                                  <IconButton
                                    aria-label={`salvar financiamento ${String(editedFinanciamento?.descricao || '').trim()}`.trim()}
                                    color="success"
                                    onClick={handleSaveEdit}
                                  >
                                    <FontAwesomeIcon icon={faCheck} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancelar">
                                  <IconButton aria-label="cancelar edicao financiamento" color="inherit" onClick={() => setEditingId(null)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            ) : (
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Editar">
                                  <IconButton aria-label={`editar financiamento ${String(financiamento?.descricao || '').trim()}`.trim()} onClick={() => handleEdit(financiamento)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                  <IconButton aria-label={`excluir financiamento ${String(financiamento?.descricao || '').trim()}`.trim()} color="error" onClick={() => handleDelete(financiamento._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Detalhes">
                                  <IconButton aria-label={`detalhes financiamento ${String(financiamento?.descricao || '').trim()}`.trim()} color="info" onClick={() => handleShowDetails(financiamento)}>
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
        </Grid>
      </Grid>

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Novo Financiamento</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={async (event) => {
              await handleSubmit(event);
              setOpenCreateModal(false);
            }}
            sx={{ pt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="descricao"
                  value={newFinanciamento.descricao}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Valor Total"
                  type="number"
                  name="valor_total"
                  value={newFinanciamento.valor_total}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Taxa de Juros (%)"
                  type="number"
                  name="taxa_juros"
                  value={newFinanciamento.taxa_juros}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Parcelas Totais"
                  type="number"
                  name="parcelas_totais"
                  value={newFinanciamento.parcelas_totais}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Data de Início"
                  type="date"
                  name="data_inicio"
                  value={newFinanciamento.data_inicio}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>

            <DialogActions sx={{ px: 0, pt: 3 }}>
              <Button variant="text" onClick={() => setOpenCreateModal(false)}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit" startIcon={<FontAwesomeIcon icon={faPlus} />}>
                Adicionar Financiamento
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsModal} onClose={handleHideDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Financiamento</DialogTitle>
        <DialogContent>
          {detailsFinanciamento && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              <Typography>
                <strong>Descrição:</strong> {detailsFinanciamento.descricao}
              </Typography>
              <Typography>
                <strong>Valor Total:</strong> R$ {Number(detailsFinanciamento.valor_total || 0).toFixed(2)}
              </Typography>
              <Typography>
                <strong>Taxa de Juros:</strong> {Number(detailsFinanciamento.taxa_juros || 0)}%
              </Typography>
              <Typography>
                <strong>Parcelas Totais:</strong> {detailsFinanciamento.parcelas_totais}
              </Typography>
              <Typography>
                <strong>Data de Início:</strong> {formatDate(detailsFinanciamento.data_inicio)}
              </Typography>
              <Typography>
                <strong>ID:</strong> {detailsFinanciamento._id}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHideDetails}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
