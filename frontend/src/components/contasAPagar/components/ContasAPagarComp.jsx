import React, { useMemo, useState } from 'react';
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
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ReceiptLong as ReceiptLongIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle, faPen, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useContasAPagarUtils } from '../utils/ContasAPagarUtils';

export default function ContasAPagarComp() {
  const [filtro, setFiltro] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const {
    contas,
    novo,
    editingId,
    edited,
    handleNovoChange,
    handleSubmitNovo,
    startEdit,
    cancelEdit,
    handleEditedChange,
    saveEdit,
    deleteConta,
  } = useContasAPagarUtils();

  const normalizedFilter = String(filtro || '').trim().toLowerCase();
  const filtered = useMemo(() => {
    return (contas || []).filter((c) => {
      const matchText = !normalizedFilter || String(c?.descricao || '').toLowerCase().includes(normalizedFilter);
      const matchStatus = !status || c?.status === status;
      return matchText && matchStatus;
    });
  }, [contas, normalizedFilter, status]);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paged = filtered.slice(startIndex, endIndex);

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
                <ReceiptLongIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Contas a Pagar</Typography>
                <Typography variant="body2" color="text.secondary">
                  Controle vencimentos e pagamentos
                </Typography>
              </Box>
              <Chip label={`${filtered.length} itens`} variant="outlined" />
            </Stack>

            <Button
              variant="contained"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              aria-label="nova conta a pagar"
              onClick={() => setOpenCreateModal(true)}
            >
              Nova Conta a Pagar
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
                `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.12
                )} 70%)`,
            }}
          >
            <CardHeader title="Filtros" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Buscar por descrição"
                    value={filtro}
                    onChange={(e) => {
                      setFiltro(e.target.value);
                      setPage(0);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Status"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(0);
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="pago">Pago</MenuItem>
                    <MenuItem value="atrasado">Atrasado</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
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
            <CardHeader title="Lista" />
            <Divider />
            <CardContent>
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 520 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Vencimento</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paged.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhuma conta a pagar cadastrada.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paged.map((row, index) => (
                        <TableRow
                          key={row._id || index}
                          hover
                          sx={{
                            backgroundColor: (theme) =>
                              index % 2 === 1 ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
                            '&:hover': {
                              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                            },
                          }}
                        >
                          <TableCell>
                            {editingId === row._id ? (
                              <TextField size="small" name="descricao" value={edited.descricao || ''} onChange={handleEditedChange} />
                            ) : (
                              row.descricao
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === row._id ? (
                              <TextField size="small" name="valor" type="number" value={edited.valor ?? ''} onChange={handleEditedChange} />
                            ) : (
                              Number(row.valor || 0).toFixed(2)
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === row._id ? (
                              <TextField
                                size="small"
                                name="vencimento"
                                type="date"
                                value={edited.vencimento || ''}
                                onChange={handleEditedChange}
                                InputLabelProps={{ shrink: true }}
                              />
                            ) : (
                              row.vencimento ? new Date(row.vencimento).toLocaleDateString() : ''
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === row._id ? (
                              <TextField
                                size="small"
                                select
                                name="status"
                                value={edited.status || 'pendente'}
                                onChange={handleEditedChange}
                              >
                                <MenuItem value="pendente">Pendente</MenuItem>
                                <MenuItem value="pago">Pago</MenuItem>
                                <MenuItem value="atrasado">Atrasado</MenuItem>
                              </TextField>
                            ) : (
                              row.status
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === row._id ? (
                              <>
                                <IconButton aria-label={`salvar conta a pagar ${edited.descricao || row.descricao}`} onClick={saveEdit}>
                                  <FontAwesomeIcon icon={faCheck} />
                                </IconButton>
                                <IconButton aria-label={`cancelar conta a pagar ${edited.descricao || row.descricao}`} onClick={cancelEdit}>
                                  <FontAwesomeIcon icon={faTimes} />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  aria-label={`detalhes conta a pagar ${row.descricao}`}
                                  onClick={() => {
                                    setSelected(row);
                                    setOpenDetailsModal(true);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faInfoCircle} />
                                </IconButton>
                                <IconButton aria-label={`editar conta a pagar ${row.descricao}`} onClick={() => startEdit(row)}>
                                  <FontAwesomeIcon icon={faPen} />
                                </IconButton>
                                <IconButton
                                  aria-label={`excluir conta a pagar ${row.descricao}`}
                                  onClick={async () => {
                                    // eslint-disable-next-line no-alert
                                    const ok = window.confirm('Confirmar exclusão?');
                                    if (!ok) return;
                                    await deleteConta(row._id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50]}
                labelRowsPerPage="Itens por página"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Conta a Pagar</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'grid', gap: 2 }}>
            <TextField label="Descrição" name="descricao" value={novo.descricao} onChange={handleNovoChange} />
            <TextField label="Valor" name="valor" type="number" value={novo.valor} onChange={handleNovoChange} />
            <TextField
              label="Vencimento"
              name="vencimento"
              type="date"
              value={novo.vencimento}
              onChange={handleNovoChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField select label="Status" name="status" value={novo.status} onChange={handleNovoChange}>
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="pago">Pago</MenuItem>
              <MenuItem value="atrasado">Atrasado</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button aria-label="cancelar criação conta a pagar" variant="text" onClick={() => setOpenCreateModal(false)}>
            Cancelar
          </Button>
          <Button
            aria-label="adicionar conta a pagar"
            variant="contained"
            onClick={async () => {
              await handleSubmitNovo();
              setOpenCreateModal(false);
            }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes da Conta a Pagar</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'grid', gap: 1 }}>
            <Typography><strong>Descrição:</strong> {selected?.descricao || ''}</Typography>
            <Typography><strong>Valor:</strong> R$ {Number(selected?.valor || 0).toFixed(2)}</Typography>
            <Typography><strong>Vencimento:</strong> {selected?.vencimento ? new Date(selected.vencimento).toLocaleDateString() : ''}</Typography>
            <Typography><strong>Status:</strong> {selected?.status || ''}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button aria-label="fechar detalhes conta a pagar" onClick={() => setOpenDetailsModal(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
