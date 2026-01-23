import React from 'react';
import {
  Alert,
  Chip,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Add as AddIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarTodayIcon,
  Check as CheckIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  SwapHoriz as SwapHorizIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useTransacoesUtils } from '../utils/TransacoesUtils';

export default function TransacoesComp() {
  const {
    transacoes,
    contas,
    categorias,
    newTransacao,
    editingId,
    editedTransacao,
    showDetailsModal,
    detailsTransacao,
    alert,
    clearAlert,
    handleHideDetails,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    formatDate,
    setEditingId,
  } = useTransacoesUtils();

  const alertSeverity = alert.variant === 'danger' ? 'error' : alert.variant;

  const formatCurrency = (value) => {
    const numeric = Number(value) || 0;
    return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const resumo = React.useMemo(() => {
    const items = Array.isArray(transacoes) ? transacoes : [];
    const receitas = items
      .filter((t) => t?.tipo === 'receita')
      .reduce((acc, t) => acc + (Number(t?.valor) || 0), 0);
    const despesas = items
      .filter((t) => t?.tipo === 'despesa')
      .reduce((acc, t) => acc + (Number(t?.valor) || 0), 0);
    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
      count: items.length,
    };
  }, [transacoes]);

  const formFieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: (theme) => alpha(theme.palette.background.default, 0.28),
      backdropFilter: 'blur(8px)',
      borderRadius: 2,
      transition: 'box-shadow 180ms ease, border-color 180ms ease, background-color 180ms ease',
      '& fieldset': {
        borderColor: 'divider',
      },
      '&:hover fieldset': {
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.55),
      },
      '&.Mui-focused': {
        boxShadow: (theme) => `0 0 0 4px ${alpha(theme.palette.primary.main, 0.18)}`,
      },
      '&.Mui-focused fieldset': {
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.8),
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'primary.main',
    },
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 0, md: 0 } }}>
      {alert.show && (
        <Box sx={{ mb: 2 }}>
          <Alert severity={alertSeverity} onClose={clearAlert}>
            {alert.message}
          </Alert>
        </Box>
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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
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
              <SwapHorizIcon />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4">Transações</Typography>
              <Typography variant="body2" color="text.secondary">
                Registre receitas e despesas e acompanhe o histórico
              </Typography>
            </Box>
            <Chip label={`${resumo.count} itens`} variant="outlined" />
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.18)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.15
                )} 70%)`,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.18),
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <TrendingUpIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Receitas</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main' }}>
                    {formatCurrency(resumo.receitas)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.18)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.15
                )} 70%)`,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.18),
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <TrendingDownIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Despesas</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'error.main' }}>
                    {formatCurrency(resumo.despesas)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.15
                )} 70%)`,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18),
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <AttachMoneyIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Saldo</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: resumo.saldo >= 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {formatCurrency(resumo.saldo)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{
          mb: 3,
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
        <CardHeader
          title="Nova Transação"
          subheader="Crie uma receita ou despesa com poucos cliques"
          avatar={
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.22),
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <AddIcon fontSize="small" />
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Conta"
                  name="conta"
                  value={newTransacao.conta}
                  onChange={handleInputChange}
                  required
                  sx={formFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountBalanceWalletIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">Selecione uma conta</MenuItem>
                  {contas.map((conta) => (
                    <MenuItem key={conta._id} value={conta._id}>
                      {conta.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Categoria"
                  name="categoria"
                  value={newTransacao.categoria}
                  onChange={handleInputChange}
                  required
                  sx={formFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">Selecione uma categoria</MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria._id} value={categoria._id}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="descricao"
                  value={newTransacao.descricao}
                  onChange={handleInputChange}
                  required
                  multiline
                  minRows={2}
                  maxRows={4}
                  sx={formFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Valor"
                  name="valor"
                  type="number"
                  value={newTransacao.valor}
                  onChange={handleInputChange}
                  required
                  sx={formFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Data"
                  name="data"
                  type="date"
                  value={newTransacao.data}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={formFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Tipo"
                  name="tipo"
                  value={newTransacao.tipo}
                  onChange={handleInputChange}
                  required
                  sx={formFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SwapHorizIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">Selecione o tipo</MenuItem>
                  <MenuItem value="receita">Receita</MenuItem>
                  <MenuItem value="despesa">Despesa</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  alignSelf: 'flex-start',
                  backgroundImage: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`,
                  boxShadow: (theme) => `0 10px 22px ${alpha(theme.palette.primary.main, 0.35)}`,
                  '&:hover': {
                    backgroundImage: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.info.dark} 100%)`,
                    boxShadow: (theme) => `0 12px 26px ${alpha(theme.palette.primary.main, 0.42)}`,
                  },
                }}
              >
                Adicionar Transação
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Lista de Transações" />
        <Divider />
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Conta</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transacoes?.length > 0 ? (
                  transacoes.map((transacao) => {
                    const isEditing = editingId === transacao._id;
                    return (
                      <TableRow key={transacao._id} hover>
                        <TableCell sx={{ minWidth: 180 }}>
                          {isEditing ? (
                            <TextField
                              select
                              size="small"
                              name="conta"
                              value={editedTransacao.conta}
                              onChange={handleEditChange}
                              fullWidth
                            >
                              {contas.map((conta) => (
                                <MenuItem key={conta._id} value={conta._id}>
                                  {conta.nome}
                                </MenuItem>
                              ))}
                            </TextField>
                          ) : (
                            transacao.conta?.nome
                          )}
                        </TableCell>

                        <TableCell sx={{ minWidth: 180 }}>
                          {isEditing ? (
                            <TextField
                              select
                              size="small"
                              name="categoria"
                              value={editedTransacao.categoria}
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
                            transacao.categoria?.nome
                          )}
                        </TableCell>

                        <TableCell sx={{ minWidth: 220 }}>
                          {isEditing ? (
                            <TextField
                              size="small"
                              name="descricao"
                              value={editedTransacao.descricao}
                              onChange={handleEditChange}
                              fullWidth
                            />
                          ) : (
                            transacao.descricao
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            minWidth: 120,
                            fontWeight: 800,
                            color: transacao.tipo === 'receita' ? 'success.main' : transacao.tipo === 'despesa' ? 'error.main' : 'text.primary',
                          }}
                        >
                          {isEditing ? (
                            <TextField
                              size="small"
                              name="valor"
                              type="number"
                              value={editedTransacao.valor}
                              onChange={handleEditChange}
                              fullWidth
                            />
                          ) : (
                            formatCurrency(transacao.valor)
                          )}
                        </TableCell>

                        <TableCell sx={{ minWidth: 120 }}>
                          {isEditing ? (
                            <TextField
                              size="small"
                              name="data"
                              type="date"
                              value={editedTransacao.data}
                              onChange={handleEditChange}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          ) : (
                            formatDate(transacao.data)
                          )}
                        </TableCell>

                        <TableCell sx={{ minWidth: 140 }}>
                          {isEditing ? (
                            <TextField
                              select
                              size="small"
                              name="tipo"
                              value={editedTransacao.tipo}
                              onChange={handleEditChange}
                              fullWidth
                            >
                              <MenuItem value="receita">Receita</MenuItem>
                              <MenuItem value="despesa">Despesa</MenuItem>
                            </TextField>
                          ) : (
                            <Chip
                              size="small"
                              label={transacao.tipo}
                              color={transacao.tipo === 'receita' ? 'success' : transacao.tipo === 'despesa' ? 'error' : 'default'}
                              variant={transacao.tipo === 'receita' || transacao.tipo === 'despesa' ? 'filled' : 'outlined'}
                            />
                          )}
                        </TableCell>

                        <TableCell align="right" sx={{ minWidth: 140 }}>
                          {isEditing ? (
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <IconButton
                                aria-label={`salvar transacao ${String(editedTransacao?.descricao || '').trim()}`.trim()}
                                color="success"
                                size="small"
                                onClick={handleSaveEdit}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                aria-label="cancelar edicao transacao"
                                color="inherit"
                                size="small"
                                onClick={() => setEditingId(null)}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          ) : (
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <IconButton
                                aria-label={`editar transacao ${String(transacao?.descricao || '').trim()}`.trim()}
                                color="primary"
                                size="small"
                                onClick={() => handleEdit(transacao)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                aria-label={`excluir transacao ${String(transacao?.descricao || '').trim()}`.trim()}
                                color="error"
                                size="small"
                                onClick={() => handleDelete(transacao._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                aria-label={`detalhes transacao ${String(transacao?.descricao || '').trim()}`.trim()}
                                color="inherit"
                                size="small"
                                onClick={() => handleShowDetails(transacao)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nenhuma transação cadastrada.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={showDetailsModal} onClose={handleHideDetails} fullWidth maxWidth="sm">
        <DialogTitle>Detalhes da Transação</DialogTitle>
        <DialogContent dividers>
          {detailsTransacao && (
            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" color="text.secondary">Conta</Typography>
                <Typography>{detailsTransacao.conta?.nome || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Categoria</Typography>
                <Typography>{detailsTransacao.categoria?.nome || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Descrição</Typography>
                <Typography>{detailsTransacao.descricao || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Valor</Typography>
                <Typography sx={{ fontWeight: 800 }}>
                  {formatCurrency(detailsTransacao.valor)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Data</Typography>
                <Typography>{formatDate(detailsTransacao.data)}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Tipo</Typography>
                <Typography sx={{ fontWeight: 800, color: detailsTransacao.tipo === 'receita' ? 'success.main' : 'error.main' }}>
                  {detailsTransacao.tipo}
                </Typography>
              </Box>
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
