import { Container, Card, Button, Form, Table, Modal, ProgressBar } from 'react-bootstrap';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
  padding: 20px;
`;

const StyledCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StyledTable = styled(Table)`
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
`;

const StyledProgressBar = styled(ProgressBar)`
  height: 10px;
  margin-top: 5px;
  
  .progress-bar {
    background-color: ${props => {
      if (props.variant === 'success') return '#28a745';
      if (props.variant === 'danger') return '#dc3545';
      if (props.variant === 'warning') return '#ffc107';
      return '#007bff';
    }};
  }
`;

const ResponsiveButton = styled(Button)`
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    margin-right: 0.3rem;
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  }

  .modal-header, .modal-footer {
    border-color: ${props => props.isDarkMode ? '#3a3a3a' : '#dee2e6'};
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
  @media (max-width: 768px) {
    height: 200px;
  }
`;

export const OrcamentosStyles = {
  StyledContainer,
  StyledCard,
  StyledTable,
  StyledProgressBar,
  ResponsiveButton,
  StyledModal,
  ChartContainer
}; 