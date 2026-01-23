import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  AccountBalanceWallet as WalletIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  CalendarMonth as CalendarMonthIcon,
  Category as CategoryIcon,
  CreditCard as CreditCardIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Inventory2 as InventoryIcon,
  Paid as PaidIcon,
  ReceiptLong as ReceiptLongIcon,
  Savings as SavingsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from "../context/ThemeContext";
 
const SidebarComp = ({ drawerWidth = 280, mobileOpen = false, onClose }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const [openSection, setOpenSection] = useState('financas');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.nome) {
          setUserName(user.nome);
        }
      } catch (error) {
        console.error('Erro ao analisar dados do usuário:', error);
      }
    }
  }, []);

  const sections = useMemo(
    () => [
      {
        id: 'financas',
        label: 'Finanças',
        icon: <WalletIcon />,
        items: [
          { to: '/transacoes', label: 'Transações', icon: <TrendingUpIcon /> },
          { to: '/categorias', label: 'Categorias', icon: <CategoryIcon /> },
          { to: '/contas', label: 'Contas', icon: <AccountBalanceIcon /> },
          { to: '/orcamentos', label: 'Orçamentos', icon: <AssessmentIcon /> },
          { to: '/despesas', label: 'Despesas', icon: <BarChartIcon /> },
        ],
      },
      {
        id: 'dividas',
        label: 'Dívidas e Pagamentos',
        icon: <PaidIcon />,
        items: [
          { to: '/contas-a-pagar', label: 'Contas a Pagar', icon: <ReceiptLongIcon /> },
          { to: '/dividas', label: 'Resumo de Dívidas', icon: <SavingsIcon /> },
          { to: '/vencimentos', label: 'Vencimentos', icon: <CalendarMonthIcon /> },
          { to: '/parcelamentos', label: 'Parcelamentos', icon: <CreditCardIcon /> },
          { to: '/financiamentos', label: 'Financiamentos', icon: <SavingsIcon /> },
        ],
      },
    ],
    []
  );

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? '' : id));
  };

  const isSelected = (to) => location.pathname === to;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            {String(userName || 'U').slice(0, 1).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }} noWrap>
              {userName || 'Usuário'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Bem-vindo de volta
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <List dense>
          <ListItemButton
            component={Link}
            to="/home"
            selected={isSelected('/home')}
            onClick={onClose}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          {sections.map((section) => {
            const open = openSection === section.id;
            return (
              <Box key={section.id}>
                <ListItemButton onClick={() => toggleSection(section.id)} sx={{ mx: 1, borderRadius: 2, mt: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 38 }}>{section.icon}</ListItemIcon>
                  <ListItemText primary={section.label} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    {section.items.map((item) => (
                      <ListItemButton
                        key={item.to}
                        component={Link}
                        to={item.to}
                        selected={isSelected(item.to)}
                        onClick={onClose}
                        sx={{ mx: 1, my: 0.25, borderRadius: 2 }}
                      >
                        <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          })}

          <Divider sx={{ my: 1.5 }} />

          <ListItemButton
            component={Link}
            to="/estoque"
            selected={isSelected('/estoque')}
            onClick={onClose}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Estoque" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/metas"
            selected={isSelected('/metas')}
            onClick={onClose}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Metas" />
          </ListItemButton>
        </List>
      </Box>

      <Divider />
      <Box sx={{ p: 2, opacity: 0.7 }}>
        <Typography variant="caption">Finanças App</Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SidebarComp;
