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

const EstoquePage = () => {
  const { isDarkMode } = useTheme();
  const [produtos, setProdutos] = useState([]);
  const [newProduto, setNewProduto] = useState({ nome: '', quantidade: '', preco: '', fornecedor: '', categoria: '' });
  const [editingId, setEditingId] = useState(null);
  const [editedProduto, setEditedProduto] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsProduto, setDetailsProduto] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    fetchProdutos();
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
          fetchProdutos();
        }
      } catch (error) {
        console.error('Erro na sincronização:', error);
      }
    }
  };

  const fetchProdutos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financasappproject.netlify.app/api/estoque', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showAlert('Erro ao buscar produtos', 'danger');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduto({ ...newProduto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://financasappproject.netlify.app/api/estoque', newProduto, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewProduto({ nome: '', quantidade: '', preco: '', fornecedor: '', categoria: '' });
      fetchProdutos();
      showAlert('Produto adicionado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      showAlert('Falha ao adicionar produto', 'danger');
    }
  };

  const handleEdit = (produto) => {
    setEditingId(produto._id);
    setEditedProduto({...produto});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduto({ ...editedProduto, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://financasappproject.netlify.app/api/estoque/${editingId}`, editedProduto, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchProdutos();
      showAlert('Produto atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      showAlert('Falha ao atualizar produto', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://financasappproject.netlify.app/api/estoque/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProdutos();
        showAlert('Produto excluído com sucesso', 'success');
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        showAlert('Falha ao excluir produto', 'danger');
      }
    }
  };

  const handleShowDetails = (produto) => {
    setDetailsProduto(produto);
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
            <h2>Estoque</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Novo Produto</Card.Title>
                <ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                          type="text"
                          name="nome"
                          value={newProduto.nome}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control
                          type="number"
                          name="quantidade"
                          value={newProduto.quantidade}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Preço</Form.Label>
                        <Form.Control
                          type="number"
                          name="preco"
                          value={newProduto.preco}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Fornecedor</Form.Label>
                        <Form.Control
                          type="text"
                          name="fornecedor"
                          value={newProduto.fornecedor}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                          type="text"
                          name="categoria"
                          value={newProduto.categoria}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                  </Row>
                  <ResponsiveButton variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Adicionar Produto
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
                <Card.Title>Lista de Produtos</Card.Title>
                <div className="table-responsive">
                  <StyledTable striped bordered hover variant={isDarkMode ? 'dark' : 'light'}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                        <th>Fornecedor</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtos.map((produto) => (
                        <tr key={produto._id}>
                          <td>
                            {editingId === produto._id ? (
                              <Form.Control
                                type="text"
                                name="nome"
                                value={editedProduto.nome}
                                onChange={handleEditChange}
                              />
                            ) : (
                              produto.nome
                            )}
                          </td>
                          <td>
                            {editingId === produto._id ? (
                              <Form.Control
                                type="number"
                                name="quantidade"
                                value={editedProduto.quantidade}
                                onChange={handleEditChange}
                              />
                            ) : (
                              produto.quantidade
                            )}
                          </td>
                          <td>
                            {editingId === produto._id ? (
                              <Form.Control
                                type="number"
                                name="preco"
                                value={editedProduto.preco}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${produto.preco.toFixed(2)}`
                            )}
                          </td>
                          <td>
                            {editingId === produto._id ? (
                              <Form.Control
                                type="text"
                                name="fornecedor"
                                value={editedProduto.fornecedor}
                                onChange={handleEditChange}
                              />
                            ) : (
                              produto.fornecedor
                            )}
                          </td>
                          <td>
                            {editingId === produto._id ? (
                              <Form.Control
                                type="text"
                                name="categoria"
                                value={editedProduto.categoria}
                                onChange={handleEditChange}
                              />
                            ) : (
                              produto.categoria
                            )}
                          </td>
                          <td>
                            {editingId === produto._id ? (
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
                                  onClick={() => handleEdit(produto)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-danger"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => handleDelete(produto._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleShowDetails(produto)}
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
            <Modal.Title>Detalhes do Produto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsProduto && (
              <>
                <p><strong>Nome:</strong> {detailsProduto.nome}</p>
                <p><strong>Quantidade:</strong> {detailsProduto.quantidade}</p>
                <p><strong>Preço:</strong> R$ {detailsProduto.preco.toFixed(2)}</p>
                <p><strong>Fornecedor:</strong> {detailsProduto.fornecedor}</p>
                <p><strong>Categoria:</strong> {detailsProduto.categoria}</p>
                <p><strong>Data de Criação:</strong> {new Date(detailsProduto.createdAt).toLocaleString()}</p>
                <p><strong>Última Atualização:</strong> {new Date(detailsProduto.updatedAt).toLocaleString()}</p>
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

export default EstoquePage;
