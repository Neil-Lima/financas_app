import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
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
import { CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
import { useVencimentosUtils } from '../utils/VencimentosUtils';

export default function VencimentosComp() {
  const [filtro, setFiltro] = useState('');
  const [tipo, setTipo] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { itens } = useVencimentosUtils();

  const normalizedFilter = String(filtro || '').trim().toLowerCase();
  const filtered = useMemo(() => {
    return (itens || []).filter((i) => {
      const matchText = !normalizedFilter || String(i?.descricao || '').toLowerCase().includes(normalizedFilter);
      const matchTipo = !tipo || i?.tipo === tipo;
      return matchText && matchTipo;
    });
  }, [itens, normalizedFilter, tipo]);

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
                <CalendarMonthIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Vencimentos</Typography>
                <Typography variant="body2" color="text.secondary">
                  Acompanhe vencimentos (contas a pagar, parcelas e financiamentos)
                </Typography>
              </Box>
              <Chip label={`${filtered.length} itens`} variant="outlined" />
            </Stack>
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
                    label="Tipo"
                    value={tipo}
                    onChange={(e) => {
                      setTipo(e.target.value);
                      setPage(0);
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="conta-a-pagar">Conta a Pagar</MenuItem>
                    <MenuItem value="parcela">Parcela</MenuItem>
                    <MenuItem value="financiamento">Financiamento</MenuItem>
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
                      <TableCell>Tipo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paged.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhum vencimento cadastrado.
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
                          <TableCell>{row.descricao}</TableCell>
                          <TableCell>{row.valor}</TableCell>
                          <TableCell>{row.vencimento}</TableCell>
                          <TableCell>{row.tipo}</TableCell>
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
    </Box>
  );
}
