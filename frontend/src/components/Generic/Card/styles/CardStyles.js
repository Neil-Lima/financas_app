import styled from 'styled-components';
import { Card } from 'react-bootstrap';

const StyledCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: ${props => props.$isDarkMode ? '#2c2c2c' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  margin-bottom: 30px;
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
`;

export const CardStyles = {
  StyledCard,
  IconWrapper
}; 