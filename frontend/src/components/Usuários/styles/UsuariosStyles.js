import styled from 'styled-components';
import { Container, Card, Button, Form, Table, Modal } from 'react-bootstrap';

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

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.color || '#007bff'};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 10px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${props => props.color || '#007bff'};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-right: 20px;
`;

const ProfileInfo = styled.div`
  h3 {
    margin-bottom: 5px;
  }
  
  p {
    color: ${props => props.isDarkMode ? '#cccccc' : '#6c757d'};
    margin-bottom: 5px;
  }
`;

const SettingsSection = styled.div`
  margin-bottom: 25px;
  
  h5 {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#3a3a3a' : '#dee2e6'};
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
`;

export const UsuariosStyles = {
  StyledContainer,
  StyledCard,
  StyledTable,
  ResponsiveButton,
  StyledModal,
  UserAvatar,
  ProfileHeader,
  ProfileAvatar,
  ProfileInfo,
  SettingsSection
}; 