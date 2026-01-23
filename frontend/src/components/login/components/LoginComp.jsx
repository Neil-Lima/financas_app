import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useLoginUtils } from '../utils/LoginUtils';

export default function LoginComp() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showRegisterModal,
    setShowRegisterModal,
    registerName,
    setRegisterName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    showAlert,
    setShowAlert,
    alertMessage,
    alertVariant,
    handleLogin,
    handleRegister,
  } = useLoginUtils();

  const alertSeverity =
    alertVariant === 'success' ? 'success' : alertVariant === 'danger' ? 'error' : alertVariant === 'warning' ? 'warning' : 'info';

  return (
    <Box
      sx={(mui) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        backgroundImage: `radial-gradient(circle at 15% 15%, rgba(79, 158, 255, 0.25) 0%, rgba(0,0,0,0) 45%), radial-gradient(circle at 80% 30%, rgba(147, 51, 234, 0.22) 0%, rgba(0,0,0,0) 50%), linear-gradient(135deg, ${mui.palette.background.default} 0%, ${mui.palette.background.paper} 100%)`,
      })}
    >
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2.25}>
            <Typography variant="h5" fontWeight={800} textAlign="center">
              Login
            </Typography>

            {showAlert && (
              <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
                {alertMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={2}>
                <TextField
                  type="email"
                  placeholder="Seu email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  type="password"
                  placeholder="Sua senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faLock} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button variant="contained" type="submit" fullWidth size="large">
                  Login
                </Button>
              </Stack>
            </Box>

            <Button variant="text" onClick={() => setShowRegisterModal(true)}>
              Não tem uma conta? Registre-se aqui
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={showRegisterModal} onClose={() => setShowRegisterModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Registro</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleRegister} sx={{ pt: 1 }}>
            <Stack spacing={2}>
              <TextField
                type="text"
                placeholder="Seu nome"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUser} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                type="email"
                placeholder="Seu email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                type="password"
                placeholder="Sua senha"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faLock} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button variant="contained" type="submit" fullWidth size="large">
                Registrar
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
