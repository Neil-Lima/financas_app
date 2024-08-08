import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NavbarComp from '../components/NavbarComp';
import SidebarComp from '../components/SidebarComp';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const StyledContainer = styled(Container)`
  background-color: ${props => props.isDarkMode ? '#121212' : '#ffffff'};
  min-height: 100vh;
`;

const MainContent = styled.div`
  transition: margin-left 0.3s ease-in-out;

  @media (min-width: 769px) {
    margin-left: 250px;
  }
`;

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <StyledContainer fluid className="p-0" isDarkMode={isDarkMode}>
      <SidebarComp />
      <MainContent>
        <NavbarComp />
        <Container fluid>
          {children}
        </Container>
      </MainContent>
    </StyledContainer>
  );
};

export default Layout;
