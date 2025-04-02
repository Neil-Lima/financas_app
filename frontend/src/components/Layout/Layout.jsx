import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faExchangeAlt,
  faChartPie,
  faCreditCard,
  faWallet,
  faMoneyBillWave,
  faFileInvoiceDollar,
  faChartLine,
  faUserCircle,
  faWarehouse,
  faSignOutAlt,
  faBars,
  faMoon,
  faSun,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useTheme } from '../../shared/contexts/ThemeContext';

// Estilizando componentes
const SidebarContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.isDarkMode ? '#1e1e1e' : '#f8f9fa'};
  color: ${props => props.isDarkMode ? '#fff' : '#212529'};
  border-right: 1px solid ${props => props.isDarkMode ? '#333' : '#dee2e6'};
  transition: all 0.3s;
  width: ${props => (props.isOpen ? '250px' : '60px')};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    position: fixed;
    left: ${props => (props.isOpen ? '0' : '-250px')};
    width: 250px;
  }
`;

const MainContent = styled.div`
  margin-left: ${props => (props.isOpen ? '250px' : '60px')};
  transition: all 0.3s;
  background-color: ${props => props.isDarkMode ? '#121212' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#fff' : '#212529'};
  min-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: ${props => (props.isOpen ? 'space-between' : 'center')};
  align-items: center;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#dee2e6'};
`;

const SidebarLogo = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const NavLinkStyled = styled(Nav.Link)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: ${props => props.isDarkMode ? '#e0e0e0' : '#343a40'};
  transition: all 0.2s;
  border-left: 3px solid transparent;
  position: relative;
  
  &:hover, &.active {
    background-color: ${props => props.isDarkMode ? '#333' : '#e9ecef'};
    color: ${props => props.isDarkMode ? '#fff' : '#007bff'};
    border-left-color: #007bff;
  }
  
  .nav-text {
    margin-left: 1rem;
    font-size: 0.875rem;
    display: ${props => (props.isOpen ? 'block' : 'none')};
  }
  
  .icon {
    min-width: 1.25rem;
    text-align: center;
  }
`;

const NavHeader = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: ${props => props.isDarkMode ? '#aaa' : '#6c757d'};
  display: ${props => (props.isOpen ? 'block' : 'none')};
  margin-top: 0.5rem;
`;

const ToggleButton = styled(Button)`
  background: transparent;
  border: none;
  color: ${props => props.isDarkMode ? '#fff' : '#343a40'};
  padding: 0.5rem;
  
  &:hover, &:focus {
    background: transparent;
    color: #007bff;
    box-shadow: none;
  }
`;

const ThemeToggle = styled(Button)`
  position: absolute;
  bottom: 1rem;
  left: ${props => (props.isOpen ? '1rem' : '50%')};
  transform: ${props => (props.isOpen ? 'none' : 'translateX(-50%)')};
  background: transparent;
  border: none;
  color: ${props => props.isDarkMode ? '#fff' : '#343a40'};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  
  .toggle-text {
    margin-left: 0.5rem;
    display: ${props => (props.isOpen ? 'block' : 'none')};
  }
  
  &:hover, &:focus {
    background: transparent;
    color: #007bff;
    box-shadow: none;
  }
`;

const MobileNavbar = styled.div`
  background-color: ${props => props.isDarkMode ? '#1e1e1e' : '#f8f9fa'};
  padding: 0.75rem 1rem;
  display: none;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const UserInfo = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.isDarkMode ? '#333' : '#dee2e6'};
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  position: absolute;
  bottom: 3rem;
  width: 100%;
  
  .user-avatar {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
  
  .user-name {
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .user-role {
    font-size: 0.75rem;
    color: ${props => props.isDarkMode ? '#aaa' : '#6c757d'};
  }
`;

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  
  // Estrutura de menus
  const menuItems = [
    { type: 'link', path: '/home', name: 'Início', icon: faHome },
    { type: 'header', name: 'Finanças' },
    { type: 'link', path: '/transacoes', name: 'Transações', icon: faExchangeAlt },
    { type: 'link', path: '/contas', name: 'Contas', icon: faWallet },
    { type: 'link', path: '/despesas', name: 'Despesas', icon: faMoneyBillWave },
    { type: 'link', path: '/parcelamentos', name: 'Parcelamentos', icon: faFileInvoiceDollar },
    { type: 'link', path: '/financiamentos', name: 'Financiamentos', icon: faCreditCard },
    { type: 'header', name: 'Planejamento' },
    { type: 'link', path: '/orcamentos', name: 'Orçamentos', icon: faClipboardList },
    { type: 'link', path: '/metas', name: 'Metas', icon: faChartLine },
    { type: 'header', name: 'Análises' },
    { type: 'link', path: '/relatorios', name: 'Relatórios', icon: faChartPie },
    { type: 'header', name: 'Outros' },
    { type: 'link', path: '/estoque', name: 'Estoque', icon: faWarehouse },
    { type: 'link', path: '/usuarios', name: 'Usuário', icon: faUserCircle },
  ];
  
  return (
    <>
      <SidebarContainer isOpen={sidebarOpen} isDarkMode={isDarkMode}>
        <SidebarHeader isOpen={sidebarOpen} isDarkMode={isDarkMode}>
          <SidebarLogo isOpen={sidebarOpen}>Finanças App</SidebarLogo>
          <ToggleButton 
            onClick={toggleSidebar}
            isDarkMode={isDarkMode}
          >
            <FontAwesomeIcon icon={faBars} />
          </ToggleButton>
        </SidebarHeader>
        
        <Nav className="flex-column">
          {menuItems.map((item, index) => {
            if (item.type === 'header') {
              return (
                <NavHeader key={index} isOpen={sidebarOpen} isDarkMode={isDarkMode}>
                  {item.name}
                </NavHeader>
              );
            } else if (item.type === 'link') {
              return (
                <NavLinkStyled
                  key={index}
                  as={Link}
                  to={item.path}
                  active={location.pathname === item.path}
                  isOpen={sidebarOpen}
                  isDarkMode={isDarkMode}
                >
                  <div className="icon">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="nav-text">{item.name}</span>
                </NavLinkStyled>
              );
            }
            return null;
          })}
        </Nav>
        
        <UserInfo isOpen={sidebarOpen} isDarkMode={isDarkMode}>
          <div className="user-avatar">
            <FontAwesomeIcon icon={faUserCircle} />
          </div>
          <div>
            <div className="user-name">Usuário</div>
            <div className="user-role">Administrador</div>
          </div>
        </UserInfo>
        
        <ThemeToggle 
          onClick={toggleTheme}
          isOpen={sidebarOpen}
          isDarkMode={isDarkMode}
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          <span className="toggle-text">
            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </span>
        </ThemeToggle>
      </SidebarContainer>
      
      <MobileNavbar isDarkMode={isDarkMode}>
        <ToggleButton 
          onClick={toggleSidebar}
          isDarkMode={isDarkMode}
        >
          <FontAwesomeIcon icon={faBars} />
        </ToggleButton>
        <div>Finanças App</div>
        <Button 
          variant="link" 
          onClick={handleLogout}
          className="p-0"
          style={{ color: isDarkMode ? '#fff' : '#343a40' }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </Button>
      </MobileNavbar>
      
      <MainContent isOpen={sidebarOpen} isDarkMode={isDarkMode}>
        <div style={{ paddingTop: window.innerWidth <= 768 ? '56px' : '0' }}>
          {children}
        </div>
      </MainContent>
    </>
  );
};

export default Layout; 