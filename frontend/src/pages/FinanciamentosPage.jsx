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

const FinanciamentosPage = () => {
  const { isDarkMode } = useTheme();
  const [financiamentos, setFinanciamentos] = useState([]);
  const [newFinanciamento, setNewFinanciamento] = useState({
    descricao: '',
    valor_total: '',
    taxa_juros: '',
    parcelas_totais: '',
    data_inicio: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedFinanciamento, setEditedFinanciamento] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsFinanciamento, setDetailsFinanciamento] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    fetchFinanciamentos();
  }, []);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      syncData();
    }, 5000); // Sincroniza a cada 5 segundos

    return () => clearInterval(syncInterval);
  }, []);

  const syncData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('https://financasappproject.netlify.app/api/sync', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.lastSync !== lastSync) {
          setLastSync(response.data.lastSync);
          fetchFinanciamentos();
        }
      } catch (error) {
        console.error('Erro na sincronização:', error);
      }
    }
  };

  const fetchFinanciamentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financasappproject.netlify.app/api/financiamentos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFinanciamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar financiamentos:', error);
      showAlert('Erro ao buscar financiamentos', 'danger');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFinanciamento({ ...newFinanciamento, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formattedData = {
        ...newFinanciamento,
        data_inicio: new Date(newFinanciamento.data_inicio).toISOString()
      };
      await axios.post('https://financasappproject.netlify.app/api/financiamentos', formattedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewFinanciamento({
        descricao: '',
        valor_total: '',
        taxa_juros: '',
        parcelas_totais: '',
        data_inicio: ''
      });
      fetchFinanciamentos();
      showAlert('Financiamento adicionado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar financiamento:', error);
      showAlert('Falha ao adicionar financiamento', 'danger');
    }
  };

  const handleEdit = (financiamento) => {
    setEditingId(financiamento._id);
    setEditedFinanciamento({...financiamento, data_inicio: new Date(financiamento.data_inicio).toISOString().split('T')[0]});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedFinanciamento({ ...editedFinanciamento, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedData = {
        ...editedFinanciamento,
        data_inicio: new Date(editedFinanciamento.data_inicio).toISOString()
      };
      await axios.put(`https://financasappproject.netlify.app/api/financiamentos/${editingId}`, formattedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchFinanciamentos();
      showAlert('Financiamento atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar financiamento:', error);
      showAlert('Falha ao atualizar financiamento', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este financiamento?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://financasappproject.netlify.app/api/financiamentos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchFinanciamentos();
        showAlert('Financiamento excluído com sucesso', 'success');
      } catch (error) {
        console.error('Erro ao deletar financiamento:', error);
        showAlert('Falha ao excluir financiamento', 'danger');
      }
    }
  };

  const handleShowDetails = (financiamento) => {
    setDetailsFinanciamento(financiamento);
    setShowDetailsModal(true);
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
            <h2>Financiamentos</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Novo Financiamento</Card.Title>
                <ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          type="text"
                          name="descricao"
                          value={newFinanciamento.descricao}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Valor Total</Form.Label>
                        <Form.Control
                          type="number"
                          name="valor_total"
                          value={newFinanciamento.valor_total}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Taxa de Juros (%)</Form.Label>
                        <Form.Control
                          type="number"
                          name="taxa_juros"
                          value={newFinanciamento.taxa_juros}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Parcelas Totais</Form.Label>
                        <Form.Control
                          type="number"
                          name="parcelas_totais"
                          value={newFinanciamento.parcelas_totais}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Data de Início</Form.Label>
                        <Form.Control
                          type="date"
                          name="data_inicio"
                          value={newFinanciamento.data_inicio}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                  </Row>
                  <ResponsiveButton variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Adicionar Financiamento
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
                <Card.Title>Lista de Financiamentos</Card.Title>
                <div className="table-responsive">
                  <StyledTable striped bordered hover variant={isDarkMode ? 'dark' : 'light'}>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor Total</th>
                        <th>Taxa de Juros</th>
                        <th>Parcelas Totais</th>
                        <th>Data de Início</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financiamentos.map((financiamento) => (
                        <tr key={financiamento._id}>
                          <td>
                            {editingId === financiamento._id ? (
                              <Form.Control
                                type="text"
                                name="descricao"
                                value={editedFinanciamento.descricao}
                                onChange={handleEditChange}
                              />
                            ) : (
                              financiamento.descricao
                            )}
                          </td>
                          <td>
                            {editingId === financiamento._id ? (
                              <Form.Control
                                type="number"
                                name="valor_total"
                                value={editedFinanciamento.valor_total}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${financiamento.valor_total.toFixed(2)}`
                            )}
                          </td>
                          <td>
                            {editingId === financiamento._id ? (
                              <Form.Control
                                type="number"
                                name="taxa_juros"
                                value={editedFinanciamento.taxa_juros}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `${financiamento.taxa_juros}%`
                            )}
                          </td>
                          <td>
                            {editingId === financiamento._id ? (
                              <Form.Control
                                type="number"
                                name="parcelas_totais"
                                value={editedFinanciamento.parcelas_totais}
                                onChange={handleEditChange}
                              />
                            ) : (
                              financiamento.parcelas_totais
                            )}
                            </td>
                            <td>
                              {editingId === financiamento._id ? (
                                <Form.Control
                                  type="date"
                                  name="data_inicio"
                                  value={editedFinanciamento.data_inicio}
                                  onChange={handleEditChange}
                                />
                              ) : (
                                formatDate(financiamento.data_inicio)
                              )}
                            </td>
                            <td>
                              {editingId === financiamento._id ? (
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
                                    onClick={() => handleEdit(financiamento)}
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </ResponsiveButton>
                                  <ResponsiveButton
                                    variant="outline-danger"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => handleDelete(financiamento._id)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </ResponsiveButton>
                                  <ResponsiveButton
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() => handleShowDetails(financiamento)}
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
              <Modal.Title>Detalhes do Financiamento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detailsFinanciamento && (
                <>
                  <p><strong>Descrição:</strong> {detailsFinanciamento.descricao}</p>
                  <p><strong>Valor Total:</strong> R$ {detailsFinanciamento.valor_total.toFixed(2)}</p>
                  <p><strong>Taxa de Juros:</strong> {detailsFinanciamento.taxa_juros}%</p>
                  <p><strong>Parcelas Totais:</strong> {detailsFinanciamento.parcelas_totais}</p>
                  <p><strong>Data de Início:</strong> {formatDate(detailsFinanciamento.data_inicio)}</p>
                  <p><strong>Data de Criação:</strong> {formatDate(detailsFinanciamento.createdAt)}</p>
                  <p><strong>Última Atualização:</strong> {formatDate(detailsFinanciamento.updatedAt)}</p>
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
  
  export default FinanciamentosPage;
  
