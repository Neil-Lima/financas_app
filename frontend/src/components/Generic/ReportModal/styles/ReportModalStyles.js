import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${props => props.$isDarkMode ? '#2c2c2c' : '#ffffff'};
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  }

  .modal-header {
    border-bottom-color: ${props => props.$isDarkMode ? '#444' : '#dee2e6'};
  }

  .modal-footer {
    border-top-color: ${props => props.$isDarkMode ? '#444' : '#dee2e6'};
  }

  .close {
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  }
`;

export const ReportModalStyles = {
  StyledModal
}; 