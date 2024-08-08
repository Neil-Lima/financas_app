import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Layout from '../layout/Layout';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const StyledContainer = styled(Container)`
  padding: 20px;
`;

const StyledCard = styled(Card)`
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0,0,0,.05);
  margin-bottom: 20px;
  background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
`;

const StyledTable = styled(Table)`
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
`;

const UsuariosPage = () => {
  const { isDarkMode } = useTheme();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financasappproject.netlify.app/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const deleteUsuario = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://financasappproject.netlify.app/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const deleteAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('https://financasappproject.netlify.app/api/usuarios/deleteAll', {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsuarios();
    } catch (error) {
      console.error('Erro ao deletar todos os usuários:', error);
    }
  };

  return (
    <Layout>
      <StyledContainer>
        <Row className="mb-4">
          <Col>
            <h2>Usuários</h2>
          </Col>
        </Row>

        <Button variant="danger" onClick={deleteAllUsers} className="mb-3">
          Deletar Todos os Usuários (exceto o atual)
        </Button>

        <StyledCard isDarkMode={isDarkMode}>
          <Card.Body>
            <Card.Title>Lista de Usuários</Card.Title>
            <StyledTable striped bordered hover variant={isDarkMode ? 'dark' : 'light'} isDarkMode={isDarkMode}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Data de Criação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="mr-2">
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => deleteUsuario(usuario.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </Card.Body>
        </StyledCard>
      </StyledContainer>
    </Layout>
  );
};

export default UsuariosPage;
