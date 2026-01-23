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
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Category as CategoryIcon, Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCategoriasUtils } from '../utils/CategoriasUtils';
import { StyledContainer, StyledTable } from '../styles/CategoriasStyles';

function CategoriasFilter({ filtro, onChangeFiltro, ordenacao, onChangeOrdenacao }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
      <TextField
        fullWidth
        size="small"
        label="Filtrar categorias"
        value={filtro}
        onChange={(e) => onChangeFiltro(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: filtro ? (
            <InputAdornment position="end">
              <IconButton aria-label="limpar filtro" size="small" onClick={() => onChangeFiltro('')}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      <TextField
        select
        size="small"
        label="Ordenação"
        value={ordenacao}
        onChange={(e) => onChangeOrdenacao(e.target.value)}
        sx={{ minWidth: { xs: '100%', sm: 200 } }}
      >
        <MenuItem value="az">Nome (A-Z)</MenuItem>
        <MenuItem value="za">Nome (Z-A)</MenuItem>
      </TextField>
    </Stack>
  );
}

export default function CategoriasComp() {
  const {
    categorias,
    newCategoria,
    editingId,
    editedCategoria,
    alert,
    clearAlert,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    setEditingId,
  } = useCategoriasUtils();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('az');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const normalizedFilter = String(filtro || '').trim().toLowerCase();
  const categoriasFiltradas = (categorias || [])
    .filter((c) => {
      if (!normalizedFilter) return true;
      return String(c?.nome || '').toLowerCase().includes(normalizedFilter);
    })
    .slice()
    .sort((a, b) => {
      const an = String(a?.nome || '');
      const bn = String(b?.nome || '');
      const cmp = an.localeCompare(bn, 'pt-BR', { sensitivity: 'base' });
      return ordenacao === 'za' ? -cmp : cmp;
    });

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const categoriasPaginadas = categoriasFiltradas.slice(startIndex, endIndex);

  const alertSeverity = alert.variant === 'danger' ? 'error' : alert.variant;

  return (
    <StyledContainer sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      {alert.show && (
        <Alert severity={alertSeverity} onClose={clearAlert} sx={{ mb: 2 }}>
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
                <CategoryIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Categorias</Typography>
                <Typography variant="body2" color="text.secondary">
                  Cadastre e gerencie categorias usadas no sistema
                </Typography>
              </Box>
              <Chip label={`${Array.isArray(categorias) ? categorias.length : 0} itens`} variant="outlined" />
            </Stack>

            <Button variant="contained" onClick={() => setOpenCreateModal(true)} startIcon={<FontAwesomeIcon icon={faPlus} />}>
              Nova Categoria
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card
        sx={{
          mb: 2.5,
          overflow: 'hidden',
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${alpha(
              theme.palette.background.paper,
              0.12
            )} 70%)`,
        }}
      >
        <CardContent>
          <CategoriasFilter
            filtro={filtro}
            onChangeFiltro={(value) => {
              setFiltro(value);
              setPage(0);
            }}
            ordenacao={ordenacao}
            onChangeOrdenacao={(value) => {
              setOrdenacao(value);
              setPage(0);
            }}
          />
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
        <CardHeader title="Lista de Categorias" />
        <Divider />
        <CardContent>
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 520 }}>
            <StyledTable size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoriasPaginadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        {normalizedFilter ? 'Nenhuma categoria encontrada para o filtro.' : 'Nenhuma categoria cadastrada.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  categoriasPaginadas.map((categoria, index) => {
                  const isEditing = editingId === categoria._id;
                  return (
                    <TableRow
                      key={categoria._id}
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
                        {isEditing ? (
                          <TextField size="small" name="nome" value={editedCategoria.nome || ''} onChange={handleEditChange} />
                        ) : (
                          categoria.nome
                        )}
                      </TableCell>

                      <TableCell sx={{ minWidth: 140 }}>
                        {isEditing ? (
                          <TextField
                            select
                            size="small"
                            name="tipo"
                            value={editedCategoria.tipo || 'despesa'}
                            onChange={handleEditChange}
                            sx={{ minWidth: 140 }}
                          >
                            <MenuItem value="despesa">despesa</MenuItem>
                            <MenuItem value="receita">receita</MenuItem>
                          </TextField>
                        ) : (
                          categoria.tipo
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {!isEditing ? (
                            <>
                              <Tooltip title="Editar">
                                <IconButton aria-label={`editar categoria ${categoria?.nome || ''}`.trim()} onClick={() => handleEdit(categoria)}>
                                  <FontAwesomeIcon icon={faEdit} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton
                                  aria-label={`excluir categoria ${categoria?.nome || ''}`.trim()}
                                  color="error"
                                  onClick={() => handleDelete(categoria._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="Salvar">
                                <IconButton
                                  aria-label={`salvar categoria ${editedCategoria?.nome || ''}`.trim()}
                                  color="success"
                                  onClick={handleSaveEdit}
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancelar">
                                <IconButton aria-label="cancelar edicao categoria" onClick={() => {
                                  setEditingId(null);
                                  setEditedCategoria({});
                                }}>
                                  <FontAwesomeIcon icon={faTimes} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                  })
                )}
              </TableBody>
            </StyledTable>
          </TableContainer>

          <TablePagination
            component="div"
            count={categoriasFiltradas.length}
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

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nova Categoria</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            id="create-categoria-form"
            onSubmit={async (e) => {
              await handleSubmit(e);
              setOpenCreateModal(false);
            }}
            sx={{ pt: 1 }}
          >
            <Stack spacing={2}>
              <TextField fullWidth label="Nome" name="nome" value={newCategoria.nome} onChange={handleInputChange} />
              <TextField select fullWidth label="Tipo" name="tipo" value={newCategoria.tipo || 'despesa'} onChange={handleInputChange}>
                <MenuItem value="despesa">despesa</MenuItem>
                <MenuItem value="receita">receita</MenuItem>
              </TextField>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)} startIcon={<FontAwesomeIcon icon={faTimes} />}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            type="submit"
            form="create-categoria-form"
            startIcon={<FontAwesomeIcon icon={faCheck} />}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
}
