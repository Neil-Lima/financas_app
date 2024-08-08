import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Modal,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faEye,
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

const ParcelamentosPage = () => {
  const { isDarkMode } = useTheme();
  const [parcelamentos, setParcelamentos] = useState([]);
  const [newParcelamento, setNewParcelamento] = useState({
    descricao: "",
    valorTotal: "",
    numeroParcelas: "",
    dataInicio: "",
    categoria: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedParcelamento, setEditedParcelamento] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsParcelamento, setDetailsParcelamento] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    fetchParcelamentos();
    fetchCategorias();
  }, []);

  const fetchParcelamentos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://financas-app-kappa.vercel.app/api/parcelamentos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setParcelamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar parcelamentos:", error);
      showAlert("Erro ao buscar parcelamentos", "danger");
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
      showAlert("Erro ao buscar categorias", "danger");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewParcelamento({ ...newParcelamento, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://financas-app-kappa.vercel.app/api/parcelamentos",
        newParcelamento,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewParcelamento({
        descricao: "",
        valorTotal: "",
        numeroParcelas: "",
        dataInicio: "",
        categoria: "",
      });
      fetchParcelamentos();
      showAlert("Parcelamento adicionado com sucesso", "success");
    } catch (error) {
      console.error("Erro ao adicionar parcelamento:", error);
      showAlert("Falha ao adicionar parcelamento", "danger");
    }
  };

  const handleEdit = (parcelamento) => {
    setEditingId(parcelamento._id);
    setEditedParcelamento(parcelamento);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedParcelamento({ ...editedParcelamento, [name]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://financas-app-kappa.vercel.app/api/parcelamentos/${editingId}`,
        editedParcelamento,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingId(null);
      fetchParcelamentos();
      showAlert("Parcelamento atualizado com sucesso", "success");
    } catch (error) {
      console.error("Erro ao editar parcelamento:", error);
      showAlert("Falha ao atualizar parcelamento", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este parcelamento?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://financas-app-kappa.vercel.app/api/parcelamentos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchParcelamentos();
        showAlert("Parcelamento excluído com sucesso", "success");
      } catch (error) {
        console.error("Erro ao deletar parcelamento:", error);
        showAlert("Falha ao excluir parcelamento", "danger");
      }
    }
  };

  const handleShowDetails = (parcelamento) => {
    setDetailsParcelamento(parcelamento);
    setShowDetailsModal(true);
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(
      () => setAlert({ show: false, message: "", variant: "success" }),
      3000
    );
  };

  const chartData = {
    labels: categorias.map((categoria) => categoria.nome),
    datasets: [
      {
        label: "Total de Parcelamentos por Categoria",
        data: categorias.map((categoria) =>
          parcelamentos
            .filter(
              (parcelamento) => parcelamento.categoria._id === categoria._id
            )
            .reduce((acc, curr) => acc + curr.valorTotal, 0)
        ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
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
        labels: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      title: {
        display: true,
        text: "Total de Parcelamentos por Categoria",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
    },
  };

  return (
    <Layout>
      <StyledContainer fluid>
        {alert.show && (
          <Alert
            variant={alert.variant}
            onClose={() => setAlert({ ...alert, show: false })}
            dismissible
          >
            {alert.message}
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <h2>Parcelamentos</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Novo Parcelamento</Card.Title>
                <ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          type="text"
                          name="descricao"
                          value={newParcelamento.descricao}
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
                          name="valorTotal"
                          value={newParcelamento.valorTotal}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Número de Parcelas</Form.Label>
                        <Form.Control
                          type="number"
                          name="numeroParcelas"
                          value={newParcelamento.numeroParcelas}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ResponsiveCol>
                    <ResponsiveCol xs={12} md={2}>
                      <Form.Group>
                        <Form.Label>Data de Início</Form.Label>
                        <Form.Control
                          type="date"
                          name="dataInicio"
                          value={newParcelamento.dataInicio}
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
                          value={newParcelamento.categoria}
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
                  <ResponsiveButton
                    variant="primary"
                    type="submit"
                    className="mt-3"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Adicionar Parcelamento
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
                <Card.Title>Visão Geral de Parcelamentos</Card.Title>
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
                <Card.Title>Lista de Parcelamentos</Card.Title>
                <div className="table-responsive">
                  <StyledTable
                    striped
                    bordered
                    hover
                    variant={isDarkMode ? "dark" : "light"}
                  >
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor Total</th>
                        <th>Parcelas</th>
                        <th>Data de Início</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parcelamentos.map((parcelamento) => (
                        <tr key={parcelamento._id}>
                          <td>
                            {editingId === parcelamento._id ? (
                              <Form.Control
                                type="text"
                                name="descricao"
                                value={editedParcelamento.descricao}
                                onChange={handleEditChange}
                              />
                            ) : (
                              parcelamento.descricao
                            )}
                          </td>
                          <td>
                            {editingId === parcelamento._id ? (
                              <Form.Control
                                type="number"
                                name="valorTotal"
                                value={editedParcelamento.valorTotal}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${parcelamento.valorTotal.toFixed(2)}`
                            )}
                          </td>
                          <td>
                            {editingId === parcelamento._id ? (
                              <Form.Control
                                type="number"
                                name="numeroParcelas"
                                value={editedParcelamento.numeroParcelas}
                                onChange={handleEditChange}
                              />
                            ) : (
                              parcelamento.numeroParcelas
                            )}
                          </td>
                          <td>
                            {editingId === parcelamento._id ? (
                              <Form.Control
                                type="date"
                                name="dataInicio"
                                value={editedParcelamento.dataInicio}
                                onChange={handleEditChange}
                              />
                            ) : (
                              new Date(
                                parcelamento.dataInicio
                              ).toLocaleDateString()
                            )}
                          </td>
                          <td>
                            {editingId === parcelamento._id ? (
                              <Form.Control
                                as="select"
                                name="categoria"
                                value={editedParcelamento.categoria}
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
                              parcelamento.categoria.nome
                            )}
                          </td>
                          <td>
                            {editingId === parcelamento._id ? (
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
                                  onClick={() => handleEdit(parcelamento)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(parcelamento._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </ResponsiveButton>
                                <ResponsiveButton
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() =>
                                    handleShowDetails(parcelamento)
                                  }
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
            <Modal.Title>Detalhes do Parcelamento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsParcelamento && (
              <>
                <p>
                  <strong>Descrição:</strong> {detailsParcelamento.descricao}
                </p>
                <p>
                  <strong>Valor Total:</strong> R${" "}
                  {detailsParcelamento.valorTotal.toFixed(2)}
                </p>
                <p>
                  <strong>Número de Parcelas:</strong>{" "}
                  {detailsParcelamento.numeroParcelas}
                </p>
                <p>
                  <strong>Data de Início:</strong>{" "}
                  {new Date(
                    detailsParcelamento.dataInicio
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Categoria:</strong>{" "}
                  {detailsParcelamento.categoria.nome}
                </p>
                <p>
                  <strong>ID:</strong> {detailsParcelamento._id}
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDetailsModal(false)}
            >
              Fechar
            </Button>
          </Modal.Footer>
        </StyledModal>
      </StyledContainer>
    </Layout>
  );
};

export default ParcelamentosPage;
