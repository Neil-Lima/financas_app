import styled from 'styled-components';
import { Container, Card, Button, Form, Table, Modal, Col } from 'react-bootstrap';

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
  
  th, td {
    vertical-align: middle;
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
  padding: 10px;
`;

const ResponsiveForm = styled(Form)`
  @media (max-width: 768px) {
    flex-direction: column;
    
    .form-group {
      width: 100%;
      margin-bottom: 0.5rem;
    }
  }
`;

const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const TransacoesStyles = {
  StyledContainer,
  StyledCard,
  StyledTable,
  ResponsiveButton,
  StyledModal,
  ChartContainer,
  ResponsiveForm,
  ResponsiveCol
}; 