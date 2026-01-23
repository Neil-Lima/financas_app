import React, { useState } from 'react';
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
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Flag as FlagIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faEye, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { useMetasUtils } from '../utils/MetasUtils';

export default function MetasComp() {
  const {
    newMeta,
    metasFiltradas,
    editingId,
    editedMeta,
    alert,
    clearAlert,
    filtro,
    ordenacao,
    estatisticas,
    chartData,
    chartOptions,
    setFiltro,
    setOrdenacao,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleHideDetails,
    showDetailsModal,
    detailsMeta,
    setEditingId,
  } = useMetasUtils();

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const progressoPercent = (meta) => {
    const atual = Number(meta?.valor_atual || 0);
    const alvo = Number(meta?.valor_alvo || 1);
    return (atual / alvo) * 100;
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
                <FlagIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Metas</Typography>
                <Typography variant="body2" color="text.secondary">
                  Defina objetivos e acompanhe evolução
                </Typography>
              </Box>
              <Chip label={`${Array.isArray(metasFiltradas) ? metasFiltradas.length : 0} itens`} variant="outlined" />
            </Stack>

            <Button variant="contained" onClick={() => setOpenCreateModal(true)} startIcon={<FontAwesomeIcon icon={faPlus} />}>
              Nova Meta
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={8}>
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
            <CardHeader title="Progresso Geral das Metas" />
            <Divider />
            <CardContent>
              <Line data={chartData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              overflow: 'hidden',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.14)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.12
                )} 70%)`,
            }}
          >
            <CardHeader title="Estatísticas" />
            <Divider />
            <CardContent>
              {estatisticas && (
                <Stack spacing={0.5}>
                  <Typography>Total de Metas: {estatisticas.totalMetas}</Typography>
                  <Typography>Metas Concluídas: {estatisticas.metasConcluidas}</Typography>
                  <Typography>Taxa de Conclusão: {Number(estatisticas.taxaConclusao || 0).toFixed(2)}%</Typography>
                </Stack>
              )}
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
            <CardHeader title="Lista de Metas" />
            <Divider />
            <CardContent>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Filtrar metas" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Ordenação" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
                    <MenuItem value="data_limite">Ordenar por Data Limite</MenuItem>
                    <MenuItem value="progresso">Ordenar por Progresso</MenuItem>
                    <MenuItem value="valor_alvo">Ordenar por Valor Alvo</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor Alvo</TableCell>
                      <TableCell>Valor Atual</TableCell>
                      <TableCell>Data Limite</TableCell>
                      <TableCell>Categoria</TableCell>
                      <TableCell>Recorrente</TableCell>
                      <TableCell>Progresso</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metasFiltradas.map((meta) => {
                      const percent = progressoPercent(meta);
                      const isEditing = editingId === meta._id;
                      return (
                        <TableRow key={meta._id} hover>
                          <TableCell sx={{ minWidth: 220 }}>
                            {isEditing ? (
                              <TextField size="small" name="descricao" value={editedMeta.descricao} onChange={handleEditChange} fullWidth />
                            ) : (
                              meta.descricao
                            )}
                          </TableCell>
                          <TableCell sx={{ minWidth: 140 }}>
                            {isEditing ? (
                              <TextField size="small" type="number" name="valor_alvo" value={editedMeta.valor_alvo} onChange={handleEditChange} fullWidth />
                            ) : (
                              `R$ ${Number(meta.valor_alvo || 0).toFixed(2)}`
                            )}
                          </TableCell>
                          <TableCell sx={{ minWidth: 140 }}>
                            {isEditing ? (
                              <TextField size="small" type="number" name="valor_atual" value={editedMeta.valor_atual} onChange={handleEditChange} fullWidth />
                            ) : (
                              `R$ ${Number(meta.valor_atual || 0).toFixed(2)}`
                            )}
                          </TableCell>
                          <TableCell sx={{ minWidth: 160 }}>
                            {isEditing ? (
                              <TextField size="small" type="date" name="data_limite" value={editedMeta.data_limite} onChange={handleEditChange} fullWidth />
                            ) : (
                              new Date(meta.data_limite).toLocaleDateString()
                            )}
                          </TableCell>
                          <TableCell sx={{ minWidth: 140 }}>
                            {isEditing ? (
                              <TextField select size="small" name="categoria" value={editedMeta.categoria} onChange={handleEditChange} fullWidth>
                                <MenuItem value="financeira">Financeira</MenuItem>
                                <MenuItem value="pessoal">Pessoal</MenuItem>
                                <MenuItem value="profissional">Profissional</MenuItem>
                              </TextField>
                            ) : (
                              meta.categoria
                            )}
                          </TableCell>
                          <TableCell sx={{ minWidth: 160 }}>
                            {isEditing ? (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Checkbox name="recorrente" checked={Boolean(editedMeta.recorrente)} onChange={handleEditChange} />
                                <Typography variant="body2">Recorrente</Typography>
                              </Stack>
                            ) : (
                              meta.recorrente ? 'Sim' : 'Não'
                            )}
                          </TableCell>
                          <TableCell sx={{ minWidth: 220 }}>
                            <Stack spacing={0.75}>
                              <LinearProgress variant="determinate" value={Math.max(0, Math.min(100, percent))} />
                              <Typography variant="caption" color="text.secondary">
                                {Math.max(0, percent).toFixed(2)}%
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            {isEditing ? (
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Salvar">
                                  <IconButton aria-label={`salvar meta ${String(editedMeta?.descricao || '').trim()}`.trim()} color="success" onClick={handleSaveEdit}>
                                    <FontAwesomeIcon icon={faCheck} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancelar">
                                  <IconButton aria-label="cancelar edicao meta" color="inherit" onClick={() => setEditingId(null)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            ) : (
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Editar">
                                  <IconButton aria-label={`editar meta ${String(meta?.descricao || '').trim()}`.trim()} onClick={() => handleEdit(meta)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Excluir">
                                  <IconButton aria-label={`excluir meta ${String(meta?.descricao || '').trim()}`.trim()} color="error" onClick={() => handleDelete(meta._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Detalhes">
                                  <IconButton aria-label={`detalhes meta ${String(meta?.descricao || '').trim()}`.trim()} color="info" onClick={() => handleShowDetails(meta)}>
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
        <DialogTitle>Nova Meta</DialogTitle>
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
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Descrição" name="descricao" value={newMeta.descricao} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Valor Alvo" type="number" name="valor_alvo" value={newMeta.valor_alvo} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Valor Atual" type="number" name="valor_atual" value={newMeta.valor_atual} onChange={handleInputChange} required />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Data Limite"
                  type="date"
                  name="data_limite"
                  value={newMeta.data_limite}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField select fullWidth label="Categoria" name="categoria" value={newMeta.categoria} onChange={handleInputChange} required>
                  <MenuItem value="">Selecione uma categoria</MenuItem>
                  <MenuItem value="financeira">Financeira</MenuItem>
                  <MenuItem value="pessoal">Pessoal</MenuItem>
                  <MenuItem value="profissional">Profissional</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={<Checkbox name="recorrente" checked={Boolean(newMeta.recorrente)} onChange={handleInputChange} />}
                  label="Meta Recorrente"
                />

                {newMeta.recorrente && (
                  <TextField
                    select
                    fullWidth
                    label="Período de Recorrência"
                    name="periodo_recorrencia"
                    value={newMeta.periodo_recorrencia}
                    onChange={handleInputChange}
                    required
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="">Selecione um período</MenuItem>
                    <MenuItem value="diaria">Diária</MenuItem>
                    <MenuItem value="semanal">Semanal</MenuItem>
                    <MenuItem value="mensal">Mensal</MenuItem>
                    <MenuItem value="anual">Anual</MenuItem>
                  </TextField>
                )}
              </Grid>
            </Grid>

            <DialogActions sx={{ px: 0, pt: 3 }}>
              <Button variant="text" onClick={() => setOpenCreateModal(false)}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit" startIcon={<FontAwesomeIcon icon={faPlus} />}>
                Adicionar Meta
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsModal} onClose={handleHideDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes da Meta</DialogTitle>
        <DialogContent>
          {detailsMeta && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              <Typography>
                <strong>Descrição:</strong> {detailsMeta.descricao}
              </Typography>
              <Typography>
                <strong>Valor Alvo:</strong> R$ {Number(detailsMeta.valor_alvo || 0).toFixed(2)}
              </Typography>
              <Typography>
                <strong>Valor Atual:</strong> R$ {Number(detailsMeta.valor_atual || 0).toFixed(2)}
              </Typography>
              <Typography>
                <strong>Data Limite:</strong> {new Date(detailsMeta.data_limite).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Categoria:</strong> {detailsMeta.categoria}
              </Typography>
              <Typography>
                <strong>Recorrente:</strong> {detailsMeta.recorrente ? 'Sim' : 'Não'}
              </Typography>
              {detailsMeta.recorrente && (
                <Typography>
                  <strong>Período de Recorrência:</strong> {detailsMeta.periodo_recorrencia}
                </Typography>
              )}
              <Typography>
                <strong>Progresso:</strong> {progressoPercent(detailsMeta).toFixed(2)}%
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
