import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Layout from '../layout/Layout';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
  @media (max-width: 768px) {
    height: 200px;
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

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  }
`;

const EstoquePage = () => {
  const { isDarkMode } = useTheme();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newProduto, setNewProduto] = useState({
    nome: '',
    quantidade: '',
    preco: '',
    fornecedor: '',
    categoria: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedProduto, setEditedProduto] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsProduto, setDetailsProduto] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
  }, []);

  const fetchProdutos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financas-app-kappa.vercel.app/api/estoque', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showAlert('Erro ao buscar produtos', 'danger');
    }
  };

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financas-app-kappa.vercel.app/api/categorias', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      showAlert('Erro ao buscar categorias', 'danger');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduto({ ...newProduto, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://financas-app-kappa.vercel.app/api/estoque', newProduto, {
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
    setEditedProduto(produto);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedProduto({ ...editedProduto, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://financas-app-kappa.vercel.app/api/estoque/${editingId}`, editedProduto, {
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
        await axios.delete(`https://financas-app-kappa.vercel.app/api/estoque/${id}`, {
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

  const getCategoriaUsageData = () => {
    const categoriaCount = {};
    produtos.forEach(produto => {
      if (categoriaCount[produto.categoria]) {
        categoriaCount[produto.categoria]++;
      } else {
        categoriaCount[produto.categoria] = 1;
      }
    });

    const labels = Object.keys(categoriaCount).map(categoriaId => 
      categorias.find(c => c._id === categoriaId)?.nome || 'Desconhecida'
    );
    const data = Object.values(categoriaCount);

    return { labels, data };
  };

  const categoriaUsageData = getCategoriaUsageData();

  const pieChartData = {
    labels: categoriaUsageData.labels,
    datasets: [
      {
        data: categoriaUsageData.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      },
      title: {
        display: true,
        text: 'Uso de Categorias no Mês Atual',
        color: isDarkMode ? '#ffffff' : '#000000'
      }
    }
  };

  const barChartData = {
    labels: produtos.map(p => p.nome),
    datasets: [
      {
        label: 'Quantidade em Estoque',
        data: produtos.map(p => p.quantidade),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      },
      title: {
        display: true,
        text: 'Quantidade de Produtos em Estoque',
        color: isDarkMode ? '#ffffff' : '#000000'
      }
    }
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
                          as="select"
                          name="categoria"
                          value={newProduto.categoria}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione uma categoria</option>
                          {categorias.map((categoria) => (
                            <option key={categoria._id} value={categoria._id}>
                              {categoria.nome}
                            </option>
                          ))}
                        </Form.Control>
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

        <Row className="mb-4">
          <Col md={6}>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Visão Geral do Estoque</Card.Title>
                <ChartContainer>
                  <Bar data={barChartData} options={barChartOptions} />
                </ChartContainer>
              </Card.Body>
            </StyledCard>
          </Col>
          <Col md={6}>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Uso de Categorias</Card.Title>
                <ChartContainer>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </ChartContainer>
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
                                as="select"
                                name="categoria"
                                value={editedProduto.categoria}
                                onChange={handleEditChange}
                              >
                                {categorias.map((categoria) => (
                                  <option key={categoria._id} value={categoria._id}>
                                    {categoria.nome}
                                  </option>
                                ))}
                              </Form.Control>
                            ) : (
                              categorias.find(c => c._id === produto.categoria)?.nome
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
                                  onClick={() => handleEdit(produto)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-danger"
                                  size="sm"
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
                <p><strong>Categoria:</strong> {categorias.find(c => c._id === detailsProduto.categoria)?.nome}</p>
                <p><strong>ID:</strong> {detailsProduto._id}</p>
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
