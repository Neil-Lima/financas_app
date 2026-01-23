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
  Tooltip as MuiTooltip,
  Typography,
  TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Inventory2 as Inventory2Icon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faEye, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useEstoqueUtils } from '../utils/EstoqueUtils';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EstoqueComp() {
  const {
    produtos,
    categorias,
    newProduto,
    editingId,
    editedProduto,
    showDetailsModal,
    detailsProduto,
    alert,
    clearAlert,
    pieChartData,
    barChartData,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleHideDetails,
    setEditingId,
  } = useEstoqueUtils();

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const pieChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: '#ffffff' } },
        title: { display: true, text: 'Uso de Categorias no Mês Atual', color: '#ffffff' },
      },
    }),
    []
  );

  const barChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { color: '#ffffff' } },
        x: { ticks: { color: '#ffffff' } },
      },
      plugins: {
        legend: { labels: { color: '#ffffff' } },
        title: { display: true, text: 'Quantidade de Produtos em Estoque', color: '#ffffff' },
      },
    }),
    []
  );

  const getCategoriaNome = (produto) => {
    if (!produto) return '';
    if (typeof produto.categoria === 'object' && produto.categoria) return produto.categoria.nome;
    return categorias.find((c) => c._id === produto.categoria)?.nome || '';
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
                <Inventory2Icon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Estoque</Typography>
                <Typography variant="body2" color="text.secondary">
                  Cadastre produtos e acompanhe categorias
                </Typography>
              </Box>
              <Chip label={`${Array.isArray(produtos) ? produtos.length : 0} itens`} variant="outlined" />
            </Stack>

            <Button variant="contained" onClick={() => setOpenCreateModal(true)} startIcon={<FontAwesomeIcon icon={faPlus} />}>
              Novo Produto
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              overflow: 'hidden',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.12
                )} 70%)`,
            }}
          >
            <CardHeader title="Visão Geral do Estoque" />
            <Divider />
            <CardContent sx={{ height: { xs: 260, md: 320 } }}>
              <Box sx={{ height: '100%' }}>
                <Bar data={barChartData} options={barChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
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
            <CardHeader title="Uso de Categorias" />
            <Divider />
            <CardContent sx={{ height: { xs: 260, md: 320 } }}>
              <Box sx={{ height: '100%' }}>
                <Pie data={pieChartData} options={pieChartOptions} />
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
            <CardHeader title="Lista de Produtos" />
            <Divider />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Preço</TableCell>
                      <TableCell>Fornecedor</TableCell>
                      <TableCell>Categoria</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {produtos.map((produto) => {
                      const isEditing = editingId === produto._id;

                      return (
                        <TableRow key={produto._id} hover>
                          <TableCell sx={{ minWidth: 220 }}>
                            {isEditing ? (
                              <TextField size="small" name="nome" value={editedProduto.nome} onChange={handleEditChange} fullWidth />
                            ) : (
                              produto.nome
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 140 }}>
                            {isEditing ? (
                              <TextField
                                size="small"
                                type="number"
                                name="quantidade"
                                value={editedProduto.quantidade}
                                onChange={handleEditChange}
                                fullWidth
                              />
                            ) : (
                              produto.quantidade
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 140 }}>
                            {isEditing ? (
                              <TextField size="small" type="number" name="preco" value={editedProduto.preco} onChange={handleEditChange} fullWidth />
                            ) : (
                              `R$ ${Number(produto.preco || 0).toFixed(2)}`
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 200 }}>
                            {isEditing ? (
                              <TextField size="small" name="fornecedor" value={editedProduto.fornecedor} onChange={handleEditChange} fullWidth />
                            ) : (
                              produto.fornecedor
                            )}
                          </TableCell>

                          <TableCell sx={{ minWidth: 200 }}>
                            {isEditing ? (
                              <TextField select size="small" name="categoria" value={editedProduto.categoria} onChange={handleEditChange} fullWidth>
                                {categorias.map((categoria) => (
                                  <MenuItem key={categoria._id} value={categoria._id}>
                                    {categoria.nome}
                                  </MenuItem>
                                ))}
                              </TextField>
                            ) : (
                              getCategoriaNome(produto)
                            )}
                          </TableCell>

                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            {isEditing ? (
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <MuiTooltip title="Salvar">
                                  <IconButton
                                    aria-label={`salvar produto ${String(editedProduto?.nome || '').trim()}`.trim()}
                                    color="success"
                                    onClick={handleSaveEdit}
                                  >
                                    <FontAwesomeIcon icon={faCheck} />
                                  </IconButton>
                                </MuiTooltip>
                                <MuiTooltip title="Cancelar">
                                  <IconButton aria-label="cancelar edicao produto" color="inherit" onClick={() => setEditingId(null)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                  </IconButton>
                                </MuiTooltip>
                              </Stack>
                            ) : (
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <MuiTooltip title="Editar">
                                  <IconButton aria-label={`editar produto ${String(produto?.nome || '').trim()}`.trim()} onClick={() => handleEdit(produto)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                  </IconButton>
                                </MuiTooltip>
                                <MuiTooltip title="Excluir">
                                  <IconButton aria-label={`excluir produto ${String(produto?.nome || '').trim()}`.trim()} color="error" onClick={() => handleDelete(produto._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </IconButton>
                                </MuiTooltip>
                                <MuiTooltip title="Detalhes">
                                  <IconButton aria-label={`detalhes produto ${String(produto?.nome || '').trim()}`.trim()} color="info" onClick={() => handleShowDetails(produto)}>
                                    <FontAwesomeIcon icon={faEye} />
                                  </IconButton>
                                </MuiTooltip>
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
        <DialogTitle>Novo Produto</DialogTitle>
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
                <TextField fullWidth label="Nome" name="nome" value={newProduto.nome} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth label="Quantidade" type="number" name="quantidade" value={newProduto.quantidade} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth label="Preço" type="number" name="preco" value={newProduto.preco} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField fullWidth label="Fornecedor" name="fornecedor" value={newProduto.fornecedor} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField select fullWidth label="Categoria" name="categoria" value={newProduto.categoria} onChange={handleInputChange} required>
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
                Adicionar Produto
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsModal} onClose={handleHideDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Produto</DialogTitle>
        <DialogContent>
          {detailsProduto && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              <Typography>
                <strong>Nome:</strong> {detailsProduto.nome}
              </Typography>
              <Typography>
                <strong>Quantidade:</strong> {detailsProduto.quantidade}
              </Typography>
              <Typography>
                <strong>Preço:</strong> R$ {Number(detailsProduto.preco || 0).toFixed(2)}
              </Typography>
              <Typography>
                <strong>Fornecedor:</strong> {detailsProduto.fornecedor}
              </Typography>
              <Typography>
                <strong>Categoria:</strong> {getCategoriaNome(detailsProduto)}
              </Typography>
              <Typography>
                <strong>ID:</strong> {detailsProduto._id}
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
