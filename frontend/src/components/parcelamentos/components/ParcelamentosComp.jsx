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
  MenuItem,
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
import { ViewWeek as ViewWeekIcon } from '@mui/icons-material';
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
import { useParcelamentosUtils } from '../utils/ParcelamentosUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

export default function ParcelamentosComp() {
  const {
    parcelamentos,
    newParcelamento,
    categorias,
    editingId,
    editedParcelamento,
    showDetailsModal,
    detailsParcelamento,
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
  } = useParcelamentosUtils();

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
        title: { display: true, text: 'Total de Parcelamentos por Categoria', color: '#ffffff' },
      },
    }),
    []
  );

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString();
  };

  const getCategoriaNome = (parcelamento) => {
    if (!parcelamento) return '';
    if (typeof parcelamento.categoria === 'object' && parcelamento.categoria) return parcelamento.categoria.nome;
    return categorias.find((c) => c._id === parcelamento.categoria)?.nome || '';
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
                <ViewWeekIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Parcelamentos</Typography>
                <Typography variant="body2" color="text.secondary">
                  Controle parcelamentos e acompanhe por categoria
                </Typography>
              </Box>
              <Chip label={`${Array.isArray(parcelamentos) ? parcelamentos.length : 0} itens`} variant="outlined" />
            </Stack>

            <Button variant="contained" onClick={() => setOpenCreateModal(true)} startIcon={<FontAwesomeIcon icon={faPlus} />}>
              Novo Parcelamento
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
            <CardHeader title="Visão Geral de Parcelamentos" />
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
            <CardHeader title="Lista de Parcelamentos" />
            <Divider />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor Total</TableCell>
                      <TableCell>Parcelas</TableCell>
                      <TableCell>Data de Início</TableCell>
                      <TableCell>Categoria</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parcelamentos.map((parcelamento) => {
                      const isEditing = editingId === parcelamento._id;

                      return (
                        <TableRow key={parcelamento._id} hover>
                          <TableCell sx={{ minWidth: 220 }}>
                            {isEditing ? (
                              <TextField
                                size="small"
                                name="descricao"
                                value={editedParcelamento.descricao}
                                onChange={handleEditChange}
                                fullWidth
                              />
                            ) : (
                              parcelamento.descricao
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 140 }}>
                            {isEditing ? (
                              <TextField
                                size="small"
                                type="number"
                                name="valorTotal"
                                value={editedParcelamento.valorTotal}
                                onChange={handleEditChange}
                                fullWidth
                              />
                            ) : (
                              `R$ ${Number(parcelamento.valorTotal || 0).toFixed(2)}`
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 120 }}>
                            {isEditing ? (
                              <TextField
                                size="small"
                                type="number"
                                name="numeroParcelas"
                                value={editedParcelamento.numeroParcelas}
                                onChange={handleEditChange}
                                fullWidth
                              />
                            ) : (
                              parcelamento.numeroParcelas
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 160 }}>
                            {isEditing ? (
                              <TextField
                                size="small"
                                type="date"
                                name="dataInicio"
                                value={editedParcelamento.dataInicio}
                                onChange={handleEditChange}
                                fullWidth
                              />
                            ) : (
                              formatDate(parcelamento.dataInicio)
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 200 }}>
                            {isEditing ? (
                              <TextField
                                select
                                size="small"
                                name="categoria"
                                value={editedParcelamento.categoria}
                                onChange={handleEditChange}
                                fullWidth
                              >
                                {categorias.map((categoria) => (
                                  <MenuItem key={categoria._id} value={categoria._id}>
                                    {categoria.nome}
                                  </MenuItem>
                                ))}
                              </TextField>
                            ) : (
                              getCategoriaNome(parcelamento)
                            )}
                          </TableCell>

                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            {isEditing ? (
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Salvar">
                                  <IconButton
                                    aria-label={`salvar parcelamento ${String(editedParcelamento?.descricao || '').trim()}`.trim()}
                                    color="success"
                                    onClick={handleSaveEdit}
                                  >
                                    <FontAwesomeIcon icon={faCheck} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancelar">
                                  <IconButton aria-label="cancelar edicao parcelamento" color="inherit" onClick={() => setEditingId(null)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            ) : (
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Editar">
                                  <IconButton aria-label={`editar parcelamento ${String(parcelamento?.descricao || '').trim()}`.trim()} onClick={() => handleEdit(parcelamento)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                  <IconButton aria-label={`excluir parcelamento ${String(parcelamento?.descricao || '').trim()}`.trim()} color="error" onClick={() => handleDelete(parcelamento._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Detalhes">
                                  <IconButton aria-label={`detalhes parcelamento ${String(parcelamento?.descricao || '').trim()}`.trim()} color="info" onClick={() => handleShowDetails(parcelamento)}>
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
        <DialogTitle>Novo Parcelamento</DialogTitle>
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
                  value={newParcelamento.descricao}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Valor Total"
                  type="number"
                  name="valorTotal"
                  value={newParcelamento.valorTotal}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Número de Parcelas"
                  type="number"
                  name="numeroParcelas"
                  value={newParcelamento.numeroParcelas}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Data de Início"
                  type="date"
                  name="dataInicio"
                  value={newParcelamento.dataInicio}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Categoria"
                  name="categoria"
                  value={newParcelamento.categoria}
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
            </Grid>

            <DialogActions sx={{ px: 0, pt: 3 }}>
              <Button variant="text" onClick={() => setOpenCreateModal(false)}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit" startIcon={<FontAwesomeIcon icon={faPlus} />}>
                Adicionar Parcelamento
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsModal} onClose={handleHideDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Parcelamento</DialogTitle>
        <DialogContent>
          {detailsParcelamento && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              <Typography>
                <strong>Descrição:</strong> {detailsParcelamento.descricao}
              </Typography>
              <Typography>
                <strong>Valor Total:</strong> R$ {Number(detailsParcelamento.valorTotal || 0).toFixed(2)}
              </Typography>
              <Typography>
                <strong>Número de Parcelas:</strong> {detailsParcelamento.numeroParcelas}
              </Typography>
              <Typography>
                <strong>Data de Início:</strong> {formatDate(detailsParcelamento.dataInicio)}
              </Typography>
              <Typography>
                <strong>Categoria:</strong> {getCategoriaNome(detailsParcelamento)}
              </Typography>
              <Typography>
                <strong>ID:</strong> {detailsParcelamento._id}
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
