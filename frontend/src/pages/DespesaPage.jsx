import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
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

const DespesaPage = () => {
  const { isDarkMode } = useTheme();
  const [despesas, setDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newDespesa, setNewDespesa] = useState({
    descricao: '',
    valor: '',
    data: '',
    categoria: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedDespesa, setEditedDespesa] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsDespesa, setDetailsDespesa] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchDespesas();
    fetchCategorias();
  }, []);

  const fetchDespesas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/despesas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDespesas(response.data);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      showAlert('Erro ao buscar despesas', 'danger');
    }
  };

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/categorias', {
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
    setNewDespesa({ ...newDespesa, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/despesas', newDespesa, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewDespesa({ descricao: '', valor: '', data: '', categoria: '' });
      fetchDespesas();
      showAlert('Despesa adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      showAlert('Falha ao adicionar despesa', 'danger');
    }
  };

  const handleEdit = (despesa) => {
    setEditingId(despesa._id);
    setEditedDespesa(despesa);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedDespesa({ ...editedDespesa, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/despesas/${editingId}`, editedDespesa, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchDespesas();
      showAlert('Despesa atualizada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar despesa:', error);
      showAlert('Falha ao atualizar despesa', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/despesas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDespesas();
        showAlert('Despesa excluída com sucesso', 'success');
      } catch (error) {
        console.error('Erro ao deletar despesa:', error);
        showAlert('Falha ao excluir despesa', 'danger');
      }
    }
  };

  const handleShowDetails = (despesa) => {
    setDetailsDespesa(despesa);
    setShowDetailsModal(true);
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const chartData = {
    labels: categorias.map(categoria => categoria.nome),
    datasets: [
      {
        label: 'Total de Despesas por Categoria',
        data: categorias.map(categoria => 
          despesas.filter(despesa => despesa.categoria._id === categoria._id)
            .reduce((acc, curr) => acc + curr.valor, 0)
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  };

  const chartOptions = {
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
        text: 'Total de Despesas por Categoria',
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
            <h2>Despesas</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Nova Despesa</Card.Title>
                <ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          type="text"
                          name="descricao"
                          value={newDespesa.descricao}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Valor</Form.Label>
                        <Form.Control
                          type="number"
                          name="valor"
                          value={newDespesa.valor}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="date"
                          name="data"
                          value={newDespesa.data}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                          as="select"
                          name="categoria"
                          value={newDespesa.categoria}
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
                  </Row>
                  <ResponsiveButton variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Adicionar Despesa
                  </ResponsiveButton>
                </ResponsiveForm>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Visão Geral de Despesas</Card.Title>
                <ChartContainer>
                  <Bar data={chartData} options={chartOptions} />
                </ChartContainer>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <Row>
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Lista de Despesas</Card.Title>
                <div className="table-responsive">
                  <StyledTable striped bordered hover variant={isDarkMode ? 'dark' : 'light'}>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {despesas.map((despesa) => (
                        <tr key={despesa._id}>
                          <td>
                            {editingId === despesa._id ? (
                              <Form.Control
                                type="text"
                                name="descricao"
                                value={editedDespesa.descricao}
                                onChange={handleEditChange}
                              />
                            ) : (
                              despesa.descricao
                            )}
                          </td>
                          <td>
                            {editingId === despesa._id ? (
                              <Form.Control
                                type="number"
                                name="valor"
                                value={editedDespesa.valor}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${despesa.valor.toFixed(2)}`
                            )}
                          </td>
                          <td>
                            {editingId === despesa._id ? (
                              <Form.Control
                                type="date"
                                name="data"
                                value={editedDespesa.data}
                                onChange={handleEditChange}
                              />
                            ) : (
                              new Date(despesa.data).toLocaleDateString()
                            )}
                          </td>
                          <td>
                            {editingId === despesa._id ? (
                              <Form.Control
                                as="select"
                                name="categoria"
                                value={editedDespesa.categoria}
                                onChange={handleEditChange}
                              >
                                {categorias.map(categoria => (
                                  <option key={categoria._id} value={categoria._id}>{categoria.nome}</option>
                                ))}
                              </Form.Control>
                            ) : (
                              despesa.categoria.nome
                            )}
                          </td>
                          <td>
                            {editingId === despesa._id ? (
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
                                  onClick={() => handleEdit(despesa)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(despesa._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleShowDetails(despesa)}
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
            <Modal.Title>Detalhes da Despesa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsDespesa && (
              <>
                <p><strong>Descrição:</strong> {detailsDespesa.descricao}</p>
                <p><strong>Valor:</strong> R$ {detailsDespesa.valor.toFixed(2)}</p>
                <p><strong>Data:</strong> {new Date(detailsDespesa.data).toLocaleDateString()}</p>
                <p><strong>Categoria:</strong> {detailsDespesa.categoria.nome}</p>
                <p><strong>ID:</strong> {detailsDespesa._id}</p>
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

export default DespesaPage;

