import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Alert,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faEye,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Layout from "../layout/Layout";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StyledContainer = styled(Container)`
  padding: 20px;
`;

const StyledCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: ${(props) => (props.isDarkMode ? "#2c2c2c" : "#ffffff")};
  color: ${(props) => (props.isDarkMode ? "#ffffff" : "#000000")};
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
  color: ${(props) => (props.isDarkMode ? "#ffffff" : "#000000")};
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
    background-color: ${(props) => (props.isDarkMode ? "#2c2c2c" : "#ffffff")};
    color: ${(props) => (props.isDarkMode ? "#ffffff" : "#000000")};
  }
`;

const OrcamentosPage = () => {
  const { isDarkMode } = useTheme();
  const [orcamentos, setOrcamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newOrcamento, setNewOrcamento] = useState({
    categoria: "",
    valor_planejado: "",
    valor_atual: 0,
    valor_restante: 0,
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    notas: "",
    recorrencia: "nao_recorrente",
    prioridade: 3,
    metaEconomia: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedOrcamento, setEditedOrcamento] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsOrcamento, setDetailsOrcamento] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [comparacaoAnual, setComparacaoAnual] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  useEffect(() => {
    fetchOrcamentos();
    fetchCategorias();
  }, []);

  const fetchOrcamentos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://financas-app-kappa.vercel.app/api/orcamentos?ano=${newOrcamento.ano}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrcamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar orçamentos:", error);
      showAlert('Erro ao buscar orçamentos', 'danger');
    }
  };

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://financas-app-kappa.vercel.app/api/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      showAlert('Erro ao buscar categorias', 'danger');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrcamento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://financas-app-kappa.vercel.app/api/orcamentos", newOrcamento, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewOrcamento({
        categoria: "",
        valor_planejado: "",
        valor_atual: 0,
        valor_restante: 0,
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear(),
        notas: "",
        recorrencia: "nao_recorrente",
        prioridade: 3,
        metaEconomia: 0,
      });
      fetchOrcamentos();
      showAlert('Orçamento adicionado com sucesso', 'success');
    } catch (error) {
      console.error("Erro ao adicionar orçamento:", error);
      showAlert('Falha ao adicionar orçamento', 'danger');
    }
  };

  const handleEdit = (orcamento) => {
    setEditingId(orcamento._id);
    setEditedOrcamento(orcamento);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedOrcamento({ ...editedOrcamento, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://financas-app-kappa.vercel.app/api/orcamentos/${editingId}`,
        editedOrcamento,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingId(null);
      fetchOrcamentos();
      showAlert('Orçamento atualizado com sucesso', 'success');
    } catch (error) {
      console.error("Erro ao editar orçamento:", error);
      showAlert('Falha ao atualizar orçamento', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este orçamento?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://financas-app-kappa.vercel.app/api/orcamentos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchOrcamentos();
        showAlert('Orçamento excluído com sucesso', 'success');
      } catch (error) {
        console.error("Erro ao deletar orçamento:", error);
        showAlert('Falha ao excluir orçamento', 'danger');
      }
    }
  };

  const handleShowDetails = (orcamento) => {
    setDetailsOrcamento(orcamento);
    setShowDetailsModal(true);
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleCompararAnual = async () => {
    try {
      const token = localStorage.getItem("token");
      const anoAtual = new Date().getFullYear();
      const anoAnterior = anoAtual - 1;
      const response = await axios.get(
        `https://financas-app-kappa.vercel.app/api/orcamentos/comparar-anual?anoAtual=${anoAtual}&anoAnterior=${anoAnterior}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComparacaoAnual(response.data);
    } catch (error) {
      console.error("Erro ao comparar orçamentos anuais:", error);
      showAlert('Falha ao comparar orçamentos anuais', 'danger');
    }
  };

  useEffect(() => {
    const newAlerts = orcamentos
      .filter((orcamento) => orcamento.valor_atual > orcamento.valor_planejado)
      .map(
        (orcamento) =>
          `${orcamento.categoria.nome}: Ultrapassou o limite em R$ ${(
            orcamento.valor_atual - orcamento.valor_planejado
          ).toFixed(2)}`
      );
    setAlerts(newAlerts);
  }, [orcamentos]);

  const chartData = {
    labels: orcamentos.map((orcamento) => orcamento.categoria.nome),
    datasets: [
      {
        label: "Planejado",
        data: orcamentos.map((orcamento) => orcamento.valor_planejado),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Atual",
        data: orcamentos.map((orcamento) => orcamento.valor_atual),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      title: {
        display: true,
        text: "Orçamento Planejado vs Atual",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
    },
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
            <h2>Orçamentos</h2>
          </Col>
          <Col xs="auto">
            <ResponsiveButton variant="info" onClick={() => setShowInstructionsModal(true)}>
              <FontAwesomeIcon icon={faQuestionCircle} /> Instruções
            </ResponsiveButton>
          </Col>
        </Row>

        {alerts.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning">
                <Alert.Heading>
                  Alertas de Ultrapassagem de Limites:
                </Alert.Heading>
                <ul>
                  {alerts.map((alert, index) => (
                    <li key={index}>{alert}</li>
                  ))}
                </ul>
              </Alert>
            </Col>
          </Row>
        )}

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Novo Orçamento</Card.Title>
                <ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                          as="select"
                          name="categoria"
                          value={newOrcamento.categoria}
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
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Valor Planejado</Form.Label>
                        <Form.Control
                          type="number"
                          name="valor_planejado"
                          value={newOrcamento.valor_planejado}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Mês</Form.Label>
                        <Form.Control
                          type="number"
                          name="mes"
                          value={newOrcamento.mes}
                          onChange={handleInputChange}
                          min="1"
                          max="12"
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Ano</Form.Label>
                        <Form.Control
                          type="number"
                          name="ano"
                          value={newOrcamento.ano}
                          onChange={handleInputChange}
                          required
                                              />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Notas</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="notas"
                          value={newOrcamento.notas}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Recorrência</Form.Label>
                        <Form.Control
                          as="select"
                          name="recorrencia"
                          value={newOrcamento.recorrencia}
                          onChange={handleInputChange}
                        >
                          <option value="nao_recorrente">Não Recorrente</option>
                          <option value="mensal">Mensal</option>
                          <option value="trimestral">Trimestral</option>
                          <option value="anual">Anual</option>
                        </Form.Control>
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Prioridade</Form.Label>
                        <Form.Control
                          type="number"
                          name="prioridade"
                          value={newOrcamento.prioridade}
                          onChange={handleInputChange}
                          min="1"
                          max="5"
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Meta de Economia</Form.Label>
                        <Form.Control
                          type="number"
                          name="metaEconomia"
                          value={newOrcamento.metaEconomia}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </ResponsiveCol>
                  </Row>
                  <ResponsiveButton
                    variant="primary"
                    type="submit"
                    className="mt-3"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Adicionar Orçamento
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
                <Card.Title>Visão Geral de Orçamentos</Card.Title>
                <ChartContainer>
                  <Bar data={chartData} options={chartOptions} />
                </ChartContainer>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <ResponsiveButton variant="info" onClick={handleCompararAnual}>
              Comparar com Ano Anterior
            </ResponsiveButton>
          </Col>
        </Row>

        {comparacaoAnual && (
          <Row className="mb-4">
            <Col>
              <StyledCard isDarkMode={isDarkMode}>
                <Card.Body>
                  <Card.Title>Comparação Anual</Card.Title>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Categoria</th>
                        <th>Ano Anterior</th>
                        <th>Ano Atual</th>
                        <th>Diferença</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(comparacaoAnual).map(([categoria, { anterior, atual }]) => (
                        <tr key={categoria}>
                          <td>{categoria}</td>
                          <td>R$ {anterior.toFixed(2)}</td>
                          <td>R$ {atual.toFixed(2)}</td>
                          <td>R$ {(atual - anterior).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </StyledCard>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Lista de Orçamentos</Card.Title>
                <div className="table-responsive">
                  <StyledTable
                    striped
                    hover
                    variant={isDarkMode ? "dark" : "light"}
                  >
                    <thead>
                      <tr>
                        <th>Categoria</th>
                        <th>Planejado</th>
                        <th>Atual</th>
                        <th>Restante</th>
                        <th>Progresso</th>
                        <th>Recorrência</th>
                        <th>Prioridade</th>
                        <th>Meta de Economia</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orcamentos.map((orcamento) => (
                        <tr key={orcamento._id}>
                          <td>
                            {editingId === orcamento._id ? (
                              <Form.Control
                                as="select"
                                name="categoria"
                                value={editedOrcamento.categoria}
                                onChange={handleEditChange}
                              >
                                {categorias.map((categoria) => (
                                  <option
                                    key={categoria._id}
                                    value={categoria._id}
                                  >
                                    {categoria.nome}
                                  </option>
                                ))}
                              </Form.Control>
                            ) : (
                              orcamento.categoria.nome
                            )}
                          </td>
                          <td>
                            {editingId === orcamento._id ? (
                              <Form.Control
                                type="number"
                                name="valor_planejado"
                                value={editedOrcamento.valor_planejado}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${orcamento.valor_planejado.toFixed(2)}`
                            )}
                          </td>
                          <td>R$ {orcamento.valor_atual.toFixed(2)}</td>
                          <td>R$ {orcamento.valor_restante.toFixed(2)}</td>
                          <td>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${
                                    (orcamento.valor_atual /
                                      orcamento.valor_planejado) *
                                    100
                                  }%`,
                                  backgroundColor:
                                    orcamento.valor_atual >
                                    orcamento.valor_planejado
                                      ? "red"
                                      : "green",
                                }}
                                aria-valuenow={
                                  (orcamento.valor_atual /
                                    orcamento.valor_planejado) *
                                  100
                                }
                                aria-valuemin="0"
                                aria-valuemax="100"
                              >
                                {(
                                  (orcamento.valor_atual /
                                    orcamento.valor_planejado) *
                                  100
                                ).toFixed(0)}
                                %
                              </div>
                            </div>
                          </td>
                          <td>{orcamento.recorrencia}</td>
                          <td>{orcamento.prioridade}</td>
                          <td>R$ {orcamento.metaEconomia.toFixed(2)}</td>
                          <td>
                            {editingId === orcamento._id ? (
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
                                  onClick={() => handleEdit(orcamento)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(orcamento._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleShowDetails(orcamento)}
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

        <StyledModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          isDarkMode={isDarkMode}
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalhes do Orçamento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsOrcamento && (
              <>
                <p><strong>Categoria:</strong> {detailsOrcamento.categoria.nome}</p>
                <p><strong>Valor Planejado:</strong> R$ {detailsOrcamento.valor_planejado.toFixed(2)}</p>
                <p><strong>Valor Atual:</strong> R$ {detailsOrcamento.valor_atual.toFixed(2)}</p>
                <p><strong>Valor Restante:</strong> R$ {detailsOrcamento.valor_restante.toFixed(2)}</p>
                <p><strong>Mês:</strong> {detailsOrcamento.mes}</p>
                <p><strong>Ano:</strong> {detailsOrcamento.ano}</p>
                <p><strong>Notas:</strong> {detailsOrcamento.notas}</p>
                <p><strong>Recorrência:</strong> {detailsOrcamento.recorrencia}</p>
                <p><strong>Prioridade:</strong> {detailsOrcamento.prioridade}</p>
                <p><strong>Meta de Economia:</strong> R$ {detailsOrcamento.metaEconomia.toFixed(2)}</p>
                <p><strong>ID:</strong> {detailsOrcamento._id}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </StyledModal>

        <StyledModal
          show={showInstructionsModal}
          onHide={() => setShowInstructionsModal(false)}
          isDarkMode={isDarkMode}
        >
          <Modal.Header closeButton>
            <Modal.Title>Instruções</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Como usar a página de Orçamentos:</h5>
            <ol>
              <li>Adicione um novo orçamento usando o formulário no topo da página.</li>
              <li>Visualize seus orçamentos no gráfico e na tabela abaixo.</li>
              <li>Edite ou exclua orçamentos existentes usando os botões na tabela.</li>
              <li>Compare seus orçamentos com o ano anterior usando o botão "Comparar com Ano Anterior".</li>
            </ol>
            <h5>Descrição dos campos:</h5>
            <ul>
              <li><strong>Categoria:</strong> A categoria do orçamento.</li>
              <li><strong>Valor Planejado:</strong> O valor que você planeja gastar.</li>
              <li><strong>Valor Atual:</strong> O valor que você já gastou.</li>
              <li><strong>Valor Restante:</strong> A diferença entre o planejado e o atual.</li>
              <li><strong>Recorrência:</strong> Se o orçamento se repete e com que frequência.</li>
              <li><strong>Prioridade:</strong> A importância do orçamento (1-5).</li>
              <li><strong>Meta de Economia:</strong> Quanto você pretende economizar nesta categoria.</li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInstructionsModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </StyledModal>
      </StyledContainer>
    </Layout>
  );
};

export default OrcamentosPage;

