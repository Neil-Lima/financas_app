import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { AppBar, Box, IconButton, Switch, Toolbar, Typography } from '@mui/material';
import { Brightness7 as SunIcon, DarkMode as MoonIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const NavbarComp = ({ drawerWidth = 280, onMenuClick, saldoTotal = 0 }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const formatCurrency = (value) => {
    const numeric = Number(value) || 0;
    return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <AppBar
      color="default"
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        left: 0,
        right: 0,
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        maxWidth: '100vw',
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 }, px: { xs: 1, sm: 2 } }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          size="small"
          sx={{ mr: 1, display: { md: 'none' }, p: { xs: 0.75, sm: 1 } }}
          aria-label="Abrir menu"
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          sx={{
            flexGrow: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          Home
        </Typography>

        <Typography
          variant="body2"
          noWrap
          sx={{
            display: { xs: 'none', sm: 'block' },
            mr: { sm: 1.5, md: 2 },
            fontWeight: 800,
            color: saldoTotal >= 0 ? 'success.main' : 'error.main',
            maxWidth: { sm: 220, md: 260 },
          }}
        >
          {formatCurrency(saldoTotal)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flex: '0 0 auto' }}>
          <IconButton
            color="inherit"
            aria-label="Notificações"
            size="small"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, p: { xs: 0.75, sm: 1 } }}
          >
            <FontAwesomeIcon icon={faBell} />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Mensagens"
            size="small"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, p: { xs: 0.75, sm: 1 } }}
          >
            <FontAwesomeIcon icon={faCommentDots} />
          </IconButton>
          <Switch
            checked={Boolean(isDarkMode)}
            onChange={toggleTheme}
            inputProps={{ 'aria-label': 'Alternar tema' }}
            icon={<SunIcon fontSize="small" />}
            checkedIcon={<MoonIcon fontSize="small" />}
            sx={{ mx: 0.5 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarComp;
