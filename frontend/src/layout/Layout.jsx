import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import NavbarComp from '../components/NavbarComp';
import SidebarComp from '../components/SidebarComp';
import { contasServices } from '../components/contas/services/ContasServices';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [saldoTotal, setSaldoTotal] = useState(0);

  const refreshSaldoTotal = useCallback(async () => {
    try {
      const contas = await contasServices.getContas();
      const total = (contas || []).reduce((acc, conta) => acc + (Number(conta?.saldo) || 0), 0);
      setSaldoTotal(total);
    } catch (e) {
      // não bloquear o app se falhar
      setSaldoTotal(0);
    }
  }, []);

  useEffect(() => {
    refreshSaldoTotal();
  }, [refreshSaldoTotal]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', bgcolor: 'background.default', overflowX: 'hidden' }}>
      <NavbarComp drawerWidth={drawerWidth} onMenuClick={handleDrawerToggle} saldoTotal={saldoTotal} />

      <SidebarComp
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          pt: '72px',
          px: { xs: 2, md: 3 },
          pb: 3,
        }}
      >
        {React.isValidElement(children)
          ? React.cloneElement(children, { onBalanceChanged: refreshSaldoTotal })
          : children}
      </Box>
    </Box>
  );
};

export default Layout;
