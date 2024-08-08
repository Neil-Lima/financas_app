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
  faFileImport,
  faCheck,
  faTimes,
  faSearch,
  faSort,
  faSortUp,
  faSortDown,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {
  Chart as ChartJS,
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
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${(props) => (props.isDarkMode ? "#2c2c2c" : "#ffffff")};
    color: ${(props) => (props.isDarkMode ? "#ffffff" : "#000000")};
  }
`;

const SearchInput = styled(Form.Control)`
  max-width: 300px;
  margin-bottom: 20px;
`;

const SortIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-left: 5px;
`;

const TransacoesPage = () => {
  const { isDarkMode } = useTheme();
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    conta: "",
    categoria: "",
    descricao: "",
    valor: "",
    data: "",
    tipo: "",
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("data");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filter, setFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTransaction, setDetailsTransaction] = useState(null);

  useEffect(() => {
    fetchTransacoes();
    fetchContas();
    fetchCategorias();
  }, []);

  const fetchTransacoes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/transacoes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransacoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      showAlertMessage("Erro ao buscar transações", "danger");
    }
  };

  const fetchContas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/contas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContas(response.data);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
      showAlertMessage("Erro ao buscar contas", "danger");
    }
  };

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      showAlertMessage("Erro ao buscar categorias", "danger");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/transacoes", newTransaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransacoes([...transacoes, response.data]);
      setNewTransaction({
        conta: "",
        categoria: "",
        descricao: "",
        valor: "",
        data: "",
        tipo: "",
      });
      showAlertMessage("Transação adicionada com sucesso", "success");
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      showAlertMessage("Erro ao adicionar transação", "danger");
    }
  };

  const handleEdit = (transacao) => {
    setEditingId(transacao._id);
    setEditedTransaction(transacao);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/transacoes/${editingId}`,
        editedTransaction,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransacoes(transacoes.map(t => t._id === editingId ? response.data : t));
      setEditingId(null);
      showAlertMessage("Transação atualizada com sucesso", "success");
    } catch (error) {
      console.error("Erro ao editar transação:", error);
      showAlertMessage("Erro ao editar transação", "danger");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/transacoes/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransacoes(transacoes.filter(t => t._id !== deleteId));
      setShowDeleteModal(false);
      showAlertMessage("Transação excluída com sucesso", "success");
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      showAlertMessage("Erro ao deletar transação", "danger");
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (importFile) {
      const formData = new FormData();
      formData.append("file", importFile);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:5000/api/transacoes/import", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setTransacoes([...transacoes, ...response.data]);
        setShowImportModal(false);
        showAlertMessage("Transações importadas com sucesso", "success");
      } catch (error) {
        console.error("Erro ao importar transações:", error);
        showAlertMessage("Erro ao importar transações", "danger");
      }
    }
  };

  const showAlertMessage = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredTransactions = transacoes.filter(
    (transacao) =>
      transacao.descricao.toLowerCase().includes(filter.toLowerCase()) ||
      transacao.valor.toString().includes(filter)
  );

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'categoria.nome') {
      aValue = a.categoria?.nome || '';
      bValue = b.categoria?.nome || '';
    } else if (sortField === 'conta.nome') {
      aValue = a.conta?.nome || '';
      bValue = b.conta?.nome || '';
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const chartData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Receitas",
        data: [4000, 4200, 4100, 4300, 4000, 4500],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Despesas",
        data: [3000, 3200, 2800, 3100, 2900, 3300],
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
        labels: {
          color: isDarkMode ? "#ffffff" : "#000000",
        },
      },
      title: {
        display: true,
        text: "Visão Geral de Transações",
        color: isDarkMode ? "#ffffff" : "#000000",
      },
    },
  };

  const handleShowDetails = (transacao) => {
    setDetailsTransaction(transacao);
    setShowDetailsModal(true);
  };

  return (
    <Layout>
      <StyledContainer fluid>
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <h2>Transações</h2>
          </Col>
          <Col className="text-right">
            <ResponsiveButton variant="primary" onClick={() => setShowImportModal(true)}>
              <FontAwesomeIcon icon={faFileImport} /> Importar Extrato
            </ResponsiveButton>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Nova Transação</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Conta</Form.Label>
                        <Form.Control
                          as="select"
                          name="conta"
                          value={newTransaction.conta}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione uma conta</option>
                          {contas.map((conta) => (
                            <option key={conta._id} value={conta._id}>
                              {conta.nome}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                          as="select"
                          name="categoria"
                          value={newTransaction.categoria}
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
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          type="text"
                          name="descricao"
                          value={newTransaction.descricao}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Valor</Form.Label>
                        <Form.Control
                          type="number"
                          name="valor"
                          value={newTransaction.valor}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="date"
                          name="data"
                          value={newTransaction.data}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                          as="select"
                          name="tipo"
                          value={newTransaction.tipo}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="receita">Receita</option>
                          <option value="despesa">Despesa</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <ResponsiveButton variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Adicionar Transação
                  </ResponsiveButton>
                </Form>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Visão Geral de Transações</Card.Title>
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
                <Card.Title>Lista de Transações</Card.Title>
                <SearchInput 
                  type="text" 
                  placeholder="Buscar transações..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <div className="table-responsive">
                  <StyledTable
                    striped
                    hover
                    variant={isDarkMode ? "dark" : "light"}
                    isDarkMode={isDarkMode}
                  >
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('data')}>
                          Data
                          <SortIcon 
                            icon={sortField === 'data' 
                              ? (sortDirection === 'asc' ? faSortUp : faSortDown) 
                              : faSort
                            } 
                          />
                        </th>
                        <th onClick={() => handleSort('descricao')}>
                          Descrição
                          <SortIcon 
                            icon={sortField === 'descricao' 
                              ? (sortDirection === 'asc' ? faSortUp : faSortDown) 
                              : faSort
                            } 
                          />
                        </th>
                        <th onClick={() => handleSort('categoria.nome')}>
                          Categoria
                          <SortIcon 
                            icon={sortField === 'categoria.nome' 
                              ? (sortDirection === 'asc' ? faSortUp : faSortDown) 
                              : faSort
                            } 
                          />
                        </th>
                        <th onClick={() => handleSort('conta.nome')}>
                          Conta
                          <SortIcon 
                            icon={sortField === 'conta.nome' 
                              ? (sortDirection === 'asc' ? faSortUp : faSortDown) 
                              : faSort
                            } 
                          />
                        </th>
                        <th onClick={() => handleSort('valor')}>
                          Valor
                          <SortIcon 
                            icon={sortField === 'valor' 
                              ? (sortDirection === 'asc' ? faSortUp : faSortDown) 
                              : faSort
                            } 
                          />
                        </th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((transacao) => (
                        <tr key={transacao._id}>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                type="date"
                                name="data"
                                value={editedTransaction.data}
                                onChange={handleEditChange}
                              />
                            ) : (
                              new Date(transacao.data).toLocaleDateString()
                            )}
                          </td>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                type="text"
                                name="descricao"
                                value={editedTransaction.descricao}
                                onChange={handleEditChange}
                              />
                            ) : (
                              transacao.descricao
                            )}
                          </td>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                as="select"
                                name="categoria"
                                value={editedTransaction.categoria}
                                onChange={handleEditChange}
                              >
                                {categorias.map((categoria) => (
                                  <option key={categoria._id} value={categoria._id}>
                                    {categoria.nome}
                                  </option>
                                ))}
                              </Form.Control>
                            ) : (
                              transacao.categoria?.nome || 'N/A'
                            )}
                          </td>
                          <td>
                            {editingId === transacao._id ? (
                              <Form.Control
                                as="select"
                                name="conta"
                                value={editedTransaction.conta}
                                onChange={handleEditChange}
                              >
                                {contas.map((conta) => (
                                  <option key={conta._id} value={conta._id}>
                                    {conta.nome}
                                  </option>
                                ))}
                              </Form.Control>
                            ) : (
                              transacao.conta?.nome || 'N/A'
                            )}
                          </td>
                          <td
                            className={
                              transacao.tipo === "receita"
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {editingId === transacao._id ? (
                              <Form.Control
                                type="number"
                                name="valor"
                                value={editedTransaction.valor}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${Math.abs(transacao.valor).toFixed(2)}`
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
                                  onClick={() => handleDeleteClick(transacao._id)}
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
                <div className="d-flex justify-content-center mt-3">
                  <ul className="pagination">
                    {Array.from({ length: Math.ceil(sortedTransactions.length / itemsPerPage) }).map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button onClick={() => paginate(index + 1)} className="page-link">
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <StyledModal show={showImportModal} onHide={() => setShowImportModal(false)} isDarkMode={isDarkMode}>
          <Modal.Header closeButton>
            <Modal.Title>Importar Extrato Bancário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleImportSubmit}>
              <Form.Group>
                <Form.Label>Selecione o arquivo do extrato</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setImportFile(e.target.files[0])}
                  accept=".csv,.xlsx,.xls"
                />
              </Form.Group>
              <ResponsiveButton variant="primary" type="submit">
                Importar
              </ResponsiveButton>
            </Form>
          </Modal.Body>
        </StyledModal>

        <StyledModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} isDarkMode={isDarkMode}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza que deseja excluir esta transação?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Excluir
            </Button>
          </Modal.Footer>
        </StyledModal>

        <StyledModal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} isDarkMode={isDarkMode}>
          <Modal.Header closeButton>
            <Modal.Title>Detalhes da Transação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsTransaction && (
              <>
                <p><strong>Descrição:</strong> {detailsTransaction.descricao}</p>
                <p><strong>Valor:</strong> R$ {Math.abs(detailsTransaction.valor).toFixed(2)}</p>
                <p><strong>Tipo:</strong> {detailsTransaction.tipo}</p>
                <p><strong>Data:</strong> {new Date(detailsTransaction.data).toLocaleDateString()}</p>
                <p><strong>Categoria:</strong> {detailsTransaction.categoria?.nome || 'N/A'}</p>
                <p><strong>Conta:</strong> {detailsTransaction.conta?.nome || 'N/A'}</p>
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

