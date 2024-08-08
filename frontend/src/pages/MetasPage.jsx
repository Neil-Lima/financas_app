import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
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
`;

const ResponsiveButton = styled(Button)`
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  }
`;

const MetasPage = () => {
  const { isDarkMode } = useTheme();
  const [metas, setMetas] = useState([]);
  const [newMeta, setNewMeta] = useState({
    descricao: '',
    valor_alvo: '',
    valor_atual: '',
    data_limite: '',
    categoria: '',
    recorrente: false,
    periodo_recorrencia: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editedMeta, setEditedMeta] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsMeta, setDetailsMeta] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('data_limite');
  const [estatisticas, setEstatisticas] = useState(null);

  useEffect(() => {
    fetchMetas();
    fetchEstatisticas();
  }, []);

  const fetchMetas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financasappproject.netlify.app/api/metas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetas(response.data);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      showAlert('Erro ao buscar metas', 'danger');
    }
  };

  const fetchEstatisticas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://financasappproject.netlify.app/api/metas/estatisticas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEstatisticas(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMeta({ 
      ...newMeta, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const metaData = {
        descricao: newMeta.descricao,
        valor_alvo: parseFloat(newMeta.valor_alvo),
        valor_atual: parseFloat(newMeta.valor_atual),
        data_limite: newMeta.data_limite,
        categoria: newMeta.categoria,
        recorrente: newMeta.recorrente
      };
      if (newMeta.recorrente) {
        metaData.periodo_recorrencia = newMeta.periodo_recorrencia;
      }
      await axios.post('https://financasappproject.netlify.app/api/metas', metaData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMeta({
        descricao: '',
        valor_alvo: '',
        valor_atual: '',
        data_limite: '',
        categoria: '',
        recorrente: false,
        periodo_recorrencia: ''
      });
      fetchMetas();
      showAlert('Meta adicionada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      showAlert('Falha ao adicionar meta', 'danger');
    }
  };

  const handleEdit = (meta) => {
    setEditingId(meta._id);
    setEditedMeta(meta);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedMeta({ 
      ...editedMeta, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const metaData = {
        ...editedMeta,
        valor_alvo: parseFloat(editedMeta.valor_alvo),
        valor_atual: parseFloat(editedMeta.valor_atual)
      };
      if (!editedMeta.recorrente) {
        delete metaData.periodo_recorrencia;
      }
      await axios.put(`https://financasappproject.netlify.app/api/metas/${editingId}`, metaData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchMetas();
      showAlert('Meta atualizada com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao editar meta:', error);
      showAlert('Falha ao atualizar meta', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://financasappproject.netlify.app/api/metas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMetas();
        showAlert('Meta excluída com sucesso', 'success');
      } catch (error) {
        console.error('Erro ao deletar meta:', error);
        showAlert('Falha ao excluir meta', 'danger');
      }
    }
  };

  const handleShowDetails = (meta) => {
    setDetailsMeta(meta);
    setShowDetailsModal(true);
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const filtrarMetas = () => {
    return metas.filter(meta =>
      meta.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
      meta.categoria.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const ordenarMetas = (metasFiltradas) => {
    return metasFiltradas.sort((a, b) => {
      if (ordenacao === 'data_limite') {
        return new Date(a.data_limite) - new Date(b.data_limite);
      } else if (ordenacao === 'progresso') {
        return (b.valor_atual / b.valor_alvo) - (a.valor_atual / a.valor_alvo);
      } else if (ordenacao === 'valor_alvo') {
        return b.valor_alvo - a.valor_alvo;
      }
      return 0;
    });
  };

  const metasFiltradas = ordenarMetas(filtrarMetas());

  const chartData = {
    labels: metas.map(meta => meta.descricao),
    datasets: [
      {
        label: 'Progresso das Metas',
        data: metas.map(meta => (meta.valor_atual / meta.valor_alvo) * 100),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <Layout>
      <StyledContainer>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <h2>Metas</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Nova Meta</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          type="text"
                          name="descricao"
                          value={newMeta.descricao}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Valor Alvo</Form.Label>
                        <Form.Control
                          type="number"
                          name="valor_alvo"
                          value={newMeta.valor_alvo}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Valor Atual</Form.Label>
                        <Form.Control
                          type="number"
                          name="valor_atual"
                          value={newMeta.valor_atual}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Data Limite</Form.Label>
                        <Form.Control
                          type="date"
                          name="data_limite"
                          value={newMeta.data_limite}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                          as="select"
                          name="categoria"
                          value={newMeta.categoria}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione uma categoria</option>
                          <option value="financeira">Financeira</option>
                          <option value="pessoal">Pessoal</option>
                          <option value="profissional">Profissional</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Check
                          type="checkbox"
                          label="Meta Recorrente"
                          name="recorrente"
                          checked={newMeta.recorrente}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      {newMeta.recorrente && (
                        <Form.Group>
                          <Form.Label>Período de Recorrência</Form.Label>
                          <Form.Control
                            as="select"
                            name="periodo_recorrencia"
                            value={newMeta.periodo_recorrencia}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Selecione um período</option>
                            <option value="diaria">Diária</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensal">Mensal</option>
                            <option value="anual">Anual</option>
                          </Form.Control>
                        </Form.Group>
                      )}
                    </Col>
                  </Row>
                  <ResponsiveButton variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Adicionar Meta
                  </ResponsiveButton>
                </Form>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={8}>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Progresso Geral das Metas</Card.Title>
                <Line data={chartData} options={chartOptions} />
              </Card.Body>
            </StyledCard>
          </Col>
          <Col md={4}>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Estatísticas</Card.Title>
                {estatisticas && (
                  <>
                    <p>Total de Metas: {estatisticas.totalMetas}</p>
                    <p>Metas Concluídas: {estatisticas.metasConcluidas}</p>
                    <p>Taxa de Conclusão: {estatisticas.taxaConclusao.toFixed(2)}%</p>
                  </>
                )}
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Filtrar metas..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </Col>
          <Col md={6}>           
                          <Form.Control
              as="select"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <option value="data_limite">Ordenar por Data Limite</option>
              <option value="progresso">Ordenar por Progresso</option>
              <option value="valor_alvo">Ordenar por Valor Alvo</option>
            </Form.Control>
          </Col>
        </Row>

        <Row>
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Lista de Metas</Card.Title>
                <StyledTable striped bordered hover variant={isDarkMode ? 'dark' : 'light'}>
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Valor Alvo</th>
                      <th>Valor Atual</th>
                      <th>Data Limite</th>
                      <th>Categoria</th>
                      <th>Recorrente</th>
                      <th>Progresso</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metasFiltradas.map((meta) => (
                      <tr key={meta._id}>
                        <td>{meta.descricao}</td>
                        <td>R$ {meta.valor_alvo.toFixed(2)}</td>
                        <td>R$ {meta.valor_atual.toFixed(2)}</td>
                        <td>{new Date(meta.data_limite).toLocaleDateString()}</td>
                        <td>{meta.categoria}</td>
                        <td>{meta.recorrente ? 'Sim' : 'Não'}</td>
                        <td>
                          <ProgressBar
                            now={(meta.valor_atual / meta.valor_alvo) * 100}
                            label={`${((meta.valor_atual / meta.valor_alvo) * 100).toFixed(2)}%`}
                          />
                        </td>
                        <td>
                          <ResponsiveButton
                            variant="outline-primary"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleEdit(meta)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </ResponsiveButton>
                          <ResponsiveButton
                            variant="outline-danger"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleDelete(meta._id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </ResponsiveButton>
                          <ResponsiveButton
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleShowDetails(meta)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </ResponsiveButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <StyledModal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} isDarkMode={isDarkMode}>
          <Modal.Header closeButton>
            <Modal.Title>Detalhes da Meta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsMeta && (
              <>
                <p><strong>Descrição:</strong> {detailsMeta.descricao}</p>
                <p><strong>Valor Alvo:</strong> R$ {detailsMeta.valor_alvo.toFixed(2)}</p>
                <p><strong>Valor Atual:</strong> R$ {detailsMeta.valor_atual.toFixed(2)}</p>
                <p><strong>Data Limite:</strong> {new Date(detailsMeta.data_limite).toLocaleDateString()}</p>
                <p><strong>Categoria:</strong> {detailsMeta.categoria}</p>
                <p><strong>Recorrente:</strong> {detailsMeta.recorrente ? 'Sim' : 'Não'}</p>
                {detailsMeta.recorrente && (
                  <p><strong>Período de Recorrência:</strong> {detailsMeta.periodo_recorrencia}</p>
                )}
                <p><strong>Progresso:</strong> {((detailsMeta.valor_atual / detailsMeta.valor_alvo) * 100).toFixed(2)}%</p>
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

export default MetasPage;

