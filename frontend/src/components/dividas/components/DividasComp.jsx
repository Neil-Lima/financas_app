import React from 'react';
import { Box, Card, CardContent, Chip, Divider, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Savings as SavingsIcon } from '@mui/icons-material';
import { useDividasUtils } from '../utils/DividasUtils';

export default function DividasComp() {
  const { resumo } = useDividasUtils();
  const totalDividas = Number(resumo?.total_dividas || 0);
  const totalParcelamentos = Number(resumo?.total_parcelamentos || 0);
  const totalFinanciamentos = Number(resumo?.total_financiamentos || 0);
  const proximos = Array.isArray(resumo?.proximos_vencimentos) ? resumo.proximos_vencimentos : [];

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
                <SavingsIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4">Resumo de Dívidas</Typography>
                <Typography variant="body2" color="text.secondary">
                  Visão consolidada de parcelamentos e financiamentos
                </Typography>
              </Box>
              <Chip label={resumo ? 'carregado' : 'vazio'} variant="outlined" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
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
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total em Dívidas
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                R$ {totalDividas.toFixed(2)}
              </Typography>
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
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Parcelamentos
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {totalParcelamentos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              overflow: 'hidden',
              backgroundImage: (theme) =>
                `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.14)} 0%, ${alpha(
                  theme.palette.background.paper,
                  0.12
                )} 70%)`,
            }}
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Financiamentos
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {totalFinanciamentos}
              </Typography>
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
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Próximos vencimentos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Vencimento</TableCell>
                      <TableCell>Tipo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {proximos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhum vencimento próximo.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      proximos.map((v) => (
                        <TableRow key={v._id} hover>
                          <TableCell>{v.descricao}</TableCell>
                          <TableCell>{Number(v.valor || 0).toFixed(2)}</TableCell>
                          <TableCell>{v.vencimento ? new Date(v.vencimento).toLocaleDateString() : ''}</TableCell>
                          <TableCell>{v.tipo}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
