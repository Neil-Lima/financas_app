import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Layout from '../layout/Layout';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

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
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ResponsiveButton = styled(Button)`
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    margin: 0.2rem;
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  }
`;

const ResponsiveCol = styled(Col)`
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const ResponsiveForm = styled(Form)`
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ContasPage = () => {
  const { isDarkMode } = useTheme();
  const [contas, setContas] = useState([]);
  const [newConta, setNewConta] = useState({ nome: '', saldo: '', tipo: '', data: '' });
  const [editingId, setEditingId] = useState(null);
  const [editedConta, setEditedConta] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsConta, setDetailsConta] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchContas();
  }, []);

  const fetchContas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financas-app-kappa.vercel.app/api/contas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContas(response.data);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      showAlert('Erro ao buscar contas', 'danger');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConta({ ...newConta, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://financas-app-kappa.vercel.app/api/contas', newConta, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewConta({ nome: '', saldo: '', tipo: '', data: '' });
      fetchContas();
      showAlert('Conta adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      showAlert('Falha ao adicionar conta', 'danger');
    }
  };

  const handleEdit = (conta) => {
    setEditingId(conta._id);
    setEditedConta(conta);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedConta({ ...editedConta, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://financas-app-kappa.vercel.app/api/contas/${editingId}`, editedConta, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchContas();
      showAlert('Conta atualizada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar conta:', error);
      showAlert('Falha ao atualizar conta', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://financas-app-kappa.vercel.app/api/contas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchContas();
        showAlert('Conta excluída com sucesso', 'success');
      } catch (error) {
        console.error('Erro ao deletar conta:', error);
        showAlert('Falha ao excluir conta', 'danger');
      }
    }
  };

  const handleShowDetails = (conta) => {
    setDetailsConta(conta);
    setShowDetailsModal(true);
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  return (
    <Layout>
      <StyledContainer fluid>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <h2>Contas</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Nova Conta</Card.Title>
                <ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                          type="text"
                          name="nome"
                          value={newConta.nome}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Saldo</Form.Label>
                        <Form.Control
                          type="number"
                          name="saldo"
                          value={newConta.saldo}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                          as="select"
                          name="tipo"
                          value={newConta.tipo}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="corrente">Corrente</option>
                          <option value="poupança">Poupança</option>
                          <option value="investimento">Investimento</option>
                        </Form.Control>
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="date"
                          name="data"
                          value={newConta.data}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                  </Row>
                  <ResponsiveButton variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Adicionar Conta
                  </ResponsiveButton>
                </ResponsiveForm>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <Row>
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Lista de Contas</Card.Title>
                <div className="table-responsive">
                  <StyledTable striped bordered hover variant={isDarkMode ? 'dark' : 'light'}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Saldo</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contas.map((conta) => (
                        <tr key={conta._id}>
                          <td>
                            {editingId === conta._id ? (
                              <Form.Control
                                type="text"
                                name="nome"
                                value={editedConta.nome}
                                onChange={handleEditChange}
                              />
                            ) : (
                              conta.nome
                            )}
                          </td>
                          <td>
                            {editingId === conta._id ? (
                              <Form.Control
                                type="number"
                                name="saldo"
                                value={editedConta.saldo}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${conta.saldo.toFixed(2)}`
                            )}
                          </td>
                          <td>
                            {editingId === conta._id ? (
                              <Form.Control
                                as="select"
                                name="tipo"
                                value={editedConta.tipo}
                                onChange={handleEditChange}
                              >
                                <option value="corrente">Corrente</option>
                                <option value="poupança">Poupança</option>
                                <option value="investimento">Investimento</option>
                              </Form.Control>
                            ) : (
                              conta.tipo
                            )}
                          </td>
                          <td>
                            {editingId === conta._id ? (
                              <Form.Control
                                type="date"
                                name="data"
                                value={editedConta.data}
                                onChange={handleEditChange}
                              />
                            ) : (
                              new Date(conta.data).toLocaleDateString()
                            )}
                          </td>
                          <td>
                            {editingId === conta._id ? (
                              <>
                                <ResponsiveButton
                                  variant="success"
                                  size="sm"
                                  onClick={handleSaveEdit}
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setEditingId(null)}
                                  className="ml-2"
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </ResponsiveButton>
                              </>
                            ) : (
                              <>
                                <ResponsiveButton
                                  variant="outline-primary"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => handleEdit(conta)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-danger"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => handleDelete(conta._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleShowDetails(conta)}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </ResponsiveButton>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </StyledTable>
                </div>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <StyledModal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} isDarkMode={isDarkMode}>
          <Modal.Header closeButton>
            <Modal.Title>Detalhes da Conta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsConta && (
              <>
                <p><strong>Nome:</strong> {detailsConta.nome}</p>
                <p><strong>Saldo:</strong> R$ {detailsConta.saldo.toFixed(2)}</p>
                <p><strong>Tipo:</strong> {detailsConta.tipo}</p>
                <p><strong>Data:</strong> {new Date(detailsConta.data).toLocaleDateString()}</p>
                <p><strong>ID:</strong> {detailsConta._id}</p>
                <p><strong>Data de Criação:</strong> {new Date(detailsConta.createdAt).toLocaleString()}</p>
                <p><strong>Última Atualização:</strong> {new Date(detailsConta.updatedAt).toLocaleString()}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </StyledModal>
      </StyledContainer>
    </Layout>
  );
};

export default ContasPage;
