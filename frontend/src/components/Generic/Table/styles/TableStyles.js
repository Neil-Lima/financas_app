import styled from 'styled-components';
import { Table } from 'react-bootstrap';

const StyledTable = styled(Table)`
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  background-color: ${props => props.$isDarkMode ? '#1e1e1e' : '#ffffff'};

  th, td {
    border-color: ${props => props.$isDarkMode ? '#444' : '#dee2e6'};
    padding: 12px;
    background-color: ${props => props.$isDarkMode ? '#1e1e1e' : '#ffffff'};
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  }

  tbody tr:nth-of-type(odd) {
    background-color: ${props => props.$isDarkMode ? '#2a2a2a' : '#f8f9fa'};
  }

  tbody tr:hover {
    background-color: ${props => props.$isDarkMode ? '#3a3a3a' : '#e9ecef'};
  }

  .text-success {
    color: ${props => props.$isDarkMode ? '#4caf50' : '#28a745'} !important;
  }

  .text-danger {
    color: ${props => props.$isDarkMode ? '#f44336' : '#dc3545'} !important;
  }
`;

export const TableStyles = {
  StyledTable
}; 