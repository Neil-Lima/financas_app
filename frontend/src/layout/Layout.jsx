import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../shared/components/Navbar';
import Sidebar from '../shared/components/Sidebar';
import { useTheme } from '../shared/contexts/ThemeContext';
import styled from 'styled-components';

const MainContent = styled.main`
  margin-left: 250px;
  padding: 20px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  background-color: ${props => props.$isDarkMode ? '#1a1a1a' : '#f8f9fa'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <Sidebar />
      <MainContent $isDarkMode={isDarkMode}>
        <Navbar />
        <Container fluid>
          {children}
        </Container>
      </MainContent>
    </>
  );
};

export default Layout;
