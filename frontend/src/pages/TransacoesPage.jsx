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

const TransacoesPage = () => {
  const { isDarkMode } = useTheme();
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newTransacao, setNewTransacao] = useState({
    conta: '',
    categoria: '',
    descricao: '',
    valor: '',
    data: '',
    tipo: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedTransacao, setEditedTransacao] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTransacao, setDetailsTransacao] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchTransacoes();
    fetchContas();
    fetchCategorias();
  }, []);

  const fetchTransacoes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financasappproject.netlify.app/api/transacoes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      showAlert('Erro ao buscar transações', 'danger');
    }
  };

  const fetchContas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financasappproject.netlify.app/api/contas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContas(response.data);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financasappproject.netlify.app/api/categorias', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransacao({ ...newTransacao, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://financasappproject.netlify.app/api/transacoes', newTransacao, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTransacao({ conta: '', categoria: '', descricao: '', valor: '', data: '', tipo: '' });
      fetchTransacoes();
      showAlert('Transação adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      showAlert('Falha ao adicionar transação', 'danger');
    }
  };

  const handleEdit = (transacao) => {
    setEditingId(transacao._id);
    setEditedTransacao({...transacao, data: new Date(transacao.data).toISOString().split('T')[0]});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTransacao({ ...editedTransacao, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://financasappproject.netlify.app/api/transacoes/${editingId}`, editedTransacao, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchTransacoes();
      showAlert('Transação atualizada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      showAlert('Falha ao atualizar transação', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://financasappproject.netlify.app/api/transacoes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTransacoes();
        showAlert('Transação excluída com sucesso', 'success');
      } catch (error) {
        console.error('Erro ao deletar transação:', error);
        showAlert('Falha ao excluir transação', 'danger');
      }
    }
  };

  const handleShowDetails = (transacao) => {
    setDetailsTransacao(transacao);
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
            <h2>Transações</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Nova Transação</Card.Title>
                <ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Conta</Form.Label>
                        <Form.Control
                          as="select"
                          name="conta"
                          value={newTransacao.conta}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione uma conta</option>
                          {contas.map(conta => (
                            <option key={conta._id} value={conta._id}>{conta.nome}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                          as="select"
                          name="categoria"
                          value={newTransacao.categoria}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione uma categoria</option>
                          {categorias.map(categoria => (
                            <option key={categoria._id} value={categoria._id}>{categoria.nome}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          type="text"
                          name="descricao"
                          value={newTransacao.descricao}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Valor</Form.Label>
                        <Form.Control
                          type="number"
                          name="valor"
                          value={newTransacao.valor}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="date"
                          name="data"
                          value={newTransacao.data}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                          as="select"
                          name="tipo"
                          value={newTransacao.tipo}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="receita">Receita</option>
                          <option value="despesa">Despesa</option>
                        </Form.Control>
                      </Form.Group>
                    </ResponsiveCol>
                  </Row>
                  <ResponsiveButton variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Adicionar Transação
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
                <Card.Title>Lista de Transações</Card.Title>
                <div className="table-responsive">
                  <StyledTable striped bordered hover variant={isDarkMode ? 'dark' : 'light'}>
                    <thead>
                      <tr>
                        <th>Conta</th>
                        <th>Categoria</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transacoes.map((transacao) => (
                        <tr key={transacao._id}>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                as="select"
                                name="conta"
                                value={editedTransacao.conta}
                                onChange={handleEditChange}
                              >
                                {contas.map(conta => (
                                  <option key={conta._id} value={conta._id}>{conta.nome}</option>
                                ))}
                              </Form.Control>
                            ) : (
                              transacao.conta.nome
                            )}
                          </td>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                as="select"
                                name="categoria"
                                value={editedTransacao.categoria}
                                onChange={handleEditChange}
                              >
                                {categorias.map(categoria => (
                                  <option key={categoria._id} value={categoria._id}>{categoria.nome}</option>
                                ))}
                              </Form.Control>
                            ) : (
                              transacao.categoria.nome
                            )}
                          </td>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                type="text"
                                name="descricao"
                                value={editedTransacao.descricao}
                                onChange={handleEditChange}
                              />
                            ) : (
                              transacao.descricao
                            )}
                          </td>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                type="number"
                                name="valor"
                                value={editedTransacao.valor}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${transacao.valor.toFixed(2)}`
                            )}
                          </td>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                type="date"
                                name="data"
                                value={editedTransacao.data}
                                onChange={handleEditChange}
                              />
                            ) : (
                              formatDate(transacao.data)
                            )}
                          </td>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                as="select"
                                name="tipo"
                                value={editedTransacao.tipo}
                                onChange={handleEditChange}
                              >
                                <option value="receita">Receita</option>
                                <option value="despesa">Despesa</option>
                              </Form.Control>
                            ) : (
                              transacao.tipo
                            )}
                          </td>
                          <td>
                            {editingId === transacao._id ? (
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
                                  onClick={() => handleEdit(transacao)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-danger"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => handleDelete(transacao._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleShowDetails(transacao)}
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
            <Modal.Title>Detalhes da Transação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsTransacao && (
              <>
                <p><strong>Conta:</strong> {detailsTransacao.conta.nome}</p>
                <p><strong>Categoria:</strong> {detailsTransacao.categoria.nome}</p>
                <p><strong>Descrição:</strong> {detailsTransacao.descricao}</p>
                <p><strong>Valor:</strong> R$ {detailsTransacao.valor.toFixed(2)}</p>
                <p><strong>Data:</strong> {formatDate(detailsTransacao.data)}</p>
                <p><strong>Tipo:</strong> {detailsTransacao.tipo}</p>
                <p><strong>ID:</strong> {detailsTransacao._id}</p>
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

export default TransacoesPage;
