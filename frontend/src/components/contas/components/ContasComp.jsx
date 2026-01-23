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
import { AccountBalance as AccountBalanceIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faEye, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useContasUtils } from '../utils/ContasUtils';

export default function ContasComp() {
  const {
    contas,
    newConta,
    editingId,
    editedConta,
    showDetailsModal,
    detailsConta,
    alert,
    clearAlert,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleHideDetails,
    formatDate,
    setEditingId,
  } = useContasUtils();

  const [openCreateModal, setOpenCreateModal] = useState(false);

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
                <AccountBalanceIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Contas</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gerencie contas e saldos
                </Typography>
              </Box>
              <Chip label={`${Array.isArray(contas) ? contas.length : 0} itens`} variant="outlined" />
            </Stack>

            <Button variant="contained" onClick={() => setOpenCreateModal(true)} startIcon={<FontAwesomeIcon icon={faPlus} />}>
              Nova Conta
            </Button>
          </Stack>
        </CardContent>
      </Card>

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
        <CardHeader title="Lista de Contas" />
        <Divider />
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Saldo</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contas.map((conta) => {
                  const isEditing = editingId === conta._id;

                  return (
                    <TableRow key={conta._id} hover>
                      <TableCell sx={{ minWidth: 220 }}>
                        {isEditing ? (
                          <TextField size="small" name="nome" value={editedConta.nome} onChange={handleEditChange} fullWidth />
                        ) : (
                          conta.nome
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 140 }}>
                        {isEditing ? (
                          <TextField size="small" type="number" name="saldo" value={editedConta.saldo} onChange={handleEditChange} fullWidth />
                        ) : (
                          `R$ ${Number(conta.saldo || 0).toFixed(2)}`
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 180 }}>
                        {isEditing ? (
                          <TextField select size="small" name="tipo" value={editedConta.tipo} onChange={handleEditChange} fullWidth>
                            <MenuItem value="corrente">Corrente</MenuItem>
                            <MenuItem value="poupança">Poupança</MenuItem>
                            <MenuItem value="investimento">Investimento</MenuItem>
                          </TextField>
                        ) : (
                          conta.tipo
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 160 }}>
                        {isEditing ? (
                          <TextField size="small" type="date" name="data" value={editedConta.data} onChange={handleEditChange} fullWidth />
                        ) : (
                          formatDate(conta.data)
                        )}
                      </TableCell>

                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        {isEditing ? (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Salvar">
                              <IconButton color="success" onClick={handleSaveEdit}>
                                <FontAwesomeIcon icon={faCheck} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancelar">
                              <IconButton color="inherit" onClick={() => setEditingId(null)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Editar">
                              <IconButton onClick={() => handleEdit(conta)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <IconButton color="error" onClick={() => handleDelete(conta._id)}>
                                <FontAwesomeIcon icon={faTrash} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Detalhes">
                              <IconButton color="info" onClick={() => handleShowDetails(conta)}>
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

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nova Conta</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={async (e) => {
              await handleSubmit(e);
              setOpenCreateModal(false);
            }}
            sx={{ pt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Nome" name="nome" value={newConta.nome} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth label="Saldo" type="number" name="saldo" value={newConta.saldo} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField select fullWidth label="Tipo" name="tipo" value={newConta.tipo} onChange={handleInputChange} required>
                  <MenuItem value="">Selecione o tipo</MenuItem>
                  <MenuItem value="corrente">Corrente</MenuItem>
                  <MenuItem value="poupança">Poupança</MenuItem>
                  <MenuItem value="investimento">Investimento</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Data"
                  type="date"
                  name="data"
                  value={newConta.data}
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
                Adicionar Conta
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsModal} onClose={handleHideDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes da Conta</DialogTitle>
        <DialogContent>
          {detailsConta && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              <Typography>
                <strong>Nome:</strong> {detailsConta.nome}
              </Typography>
              <Typography>
                <strong>Saldo:</strong> R$ {Number(detailsConta.saldo || 0).toFixed(2)}
              </Typography>
              <Typography>
                <strong>Tipo:</strong> {detailsConta.tipo}
              </Typography>
              <Typography>
                <strong>Data:</strong> {formatDate(detailsConta.data)}
              </Typography>
              <Typography>
                <strong>ID:</strong> {detailsConta._id}
              </Typography>
              <Typography>
                <strong>Data de Criação:</strong> {formatDate(detailsConta.createdAt)}
              </Typography>
              <Typography>
                <strong>Última Atualização:</strong> {formatDate(detailsConta.updatedAt)}
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
