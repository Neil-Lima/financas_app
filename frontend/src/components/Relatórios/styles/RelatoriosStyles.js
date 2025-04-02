import styled from 'styled-components';
import { Container, Card, Button, Form, Table, Modal } from 'react-bootstrap';

const StyledContainer = styled(Container)`
  padding: 20px;
  background-color: ${({ isDarkMode }) => isDarkMode ? '#1f1f1f' : '#f8f9fa'};
  min-height: calc(100vh - 60px);
  transition: background-color 0.3s ease;
`;

const StyledCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: ${({ isDarkMode }) => isDarkMode ? '#2c2c2c' : '#ffffff'};
  color: ${({ isDarkMode }) => isDarkMode ? '#ffffff' : '#000000'};
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .card-title {
    border-bottom: 1px solid ${({ isDarkMode }) => isDarkMode ? '#444' : '#eee'};
    padding-bottom: 10px;
    margin-bottom: 15px;
    font-weight: 600;
  }
`;

const StyledTable = styled(Table)`
  color: ${({ isDarkMode }) => isDarkMode ? '#ffffff' : '#000000'};
  
  thead {
    background-color: ${({ isDarkMode }) => isDarkMode ? '#3c3c3c' : '#f0f0f0'};
  }

  th, td {
    vertical-align: middle;
  }

  tbody tr {
    transition: background-color 0.2s ease;
    &:hover {
      background-color: ${({ isDarkMode }) => isDarkMode ? '#444' : '#f5f5f5'};
    }
  }
`;

const ResponsiveButton = styled(Button)`
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
  background-color: ${({ isDarkMode, variant }) => 
    variant === 'primary' && isDarkMode ? '#0062cc' : 
    variant === 'success' && isDarkMode ? '#28a745' : 
    variant === 'danger' && isDarkMode ? '#dc3545' : ''};
  border-color: ${({ isDarkMode, variant }) => 
    variant === 'primary' && isDarkMode ? '#005cbf' : 
    variant === 'success' && isDarkMode ? '#218838' : 
    variant === 'danger' && isDarkMode ? '#c82333' : ''};
  color: ${({ outline, isDarkMode }) => outline && isDarkMode ? '#fff' : ''};
  
  &:hover {
    background-color: ${({ isDarkMode, variant }) => 
      variant === 'primary' && isDarkMode ? '#005cbf' : 
      variant === 'success' && isDarkMode ? '#218838' : 
      variant === 'danger' && isDarkMode ? '#c82333' : ''};
    border-color: ${({ isDarkMode, variant }) => 
      variant === 'primary' && isDarkMode ? '#0056b3' : 
      variant === 'success' && isDarkMode ? '#1e7e34' : 
      variant === 'danger' && isDarkMode ? '#bd2130' : ''};
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${({ isDarkMode }) => isDarkMode ? '#2c2c2c' : '#ffffff'};
    color: ${({ isDarkMode }) => isDarkMode ? '#ffffff' : '#000000'};
  }
  
  .modal-header {
    border-bottom: 1px solid ${({ isDarkMode }) => isDarkMode ? '#444' : '#dee2e6'};
  }
  
  .modal-footer {
    border-top: 1px solid ${({ isDarkMode }) => isDarkMode ? '#444' : '#dee2e6'};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  background-color: ${({ isDarkMode }) => isDarkMode ? '#2c2c2c' : '#ffffff'};
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background-color: ${({ isDarkMode, color }) => color || (isDarkMode ? '#2c2c2c' : '#ffffff')};
  color: ${({ isDarkMode, textColor }) => textColor || (isDarkMode ? '#ffffff' : '#000000')};
  border-radius: 5px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    font-size: 1.8rem;
    margin-bottom: 5px;
    font-weight: 700;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const ReportButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`;

export const RelatoriosStyles = {
  StyledContainer,
  StyledCard,
  StyledTable,
  ResponsiveButton,
  StyledModal,
  FilterContainer,
  ChartContainer,
  StatCard,
  ReportButtonsContainer
}; 