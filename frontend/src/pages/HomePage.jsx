import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faChartLine, faExchangeAlt, faMoneyBillWave, faFileAlt, faSync, faPlus, faEdit, faTrash, faCheck, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { Line, Doughnut, Bar, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StyledContainer = styled(Container)`
  padding: 20px;
`;

const StyledCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: ${props => props.$isDarkMode ? '#2c2c2c' : '#ffffff'};
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  margin-bottom: 30px;
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 30px;
`;

const StyledDatePicker = styled(DatePicker)`
  margin-right: 15px;
`;

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

const StyledTable = styled(Table)`
  color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  background-color: ${props => props.$isDarkMode ? '#1e1e1e' : '#ffffff'};

  th, td {
    border-color: ${props => props.$isDarkMode ? '#444' : '#dee2e6'};
    padding: 12px;
    background-color: ${props => props.$isDarkMode ? '#1e1e1e' : '#ffffff'};
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  }

  tbody tr:nth-of-type(odd) {
    background-color: ${props => props.$isDarkMode ? '#2a2a2a' : '#f8f9fa'};
  }

  tbody tr:hover {
    background-color: ${props => props.$isDarkMode ? '#3a3a3a' : '#e9ecef'};
  }

  .text-success {
    color: ${props => props.$isDarkMode ? '#4caf50' : '#28a745'} !important;
  }

  .text-danger {
    color: ${props => props.$isDarkMode ? '#f44336' : '#dc3545'} !important;
  }
`;

const StyledRow = styled(Row)`
  margin-bottom: 30px;
`;

const StyledCol = styled(Col)`
  margin-bottom: 20px;
`;

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${props => props.$isDarkMode ? '#2c2c2c' : '#ffffff'};
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  }

  .modal-header {
    border-bottom-color: ${props => props.$isDarkMode ? '#444' : '#dee2e6'};
  }

  .modal-footer {
    border-top-color: ${props => props.$isDarkMode ? '#444' : '#dee2e6'};
  }

  .close {
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
  }
`;

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const [resumo, setResumo] = useState({
    saldoTotal: 0,
    receitasMes: 0,
    despesasMes: 0,
    transacoesRecentes: []
  });
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(new Date());
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const navigate = useNavigate();

  const [contas, setContas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [financiamentos, setFinanciamentos] = useState([]);
  const [metas, setMetas] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [parcelamentos, setParcelamentos] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [
        contasResponse,
        despesasResponse,
        estoqueResponse,
        financiamentosResponse,
        metasResponse,
        orcamentosResponse,
        parcelamentosResponse,
        transacoesResponse,
        categoriasResponse
      ] = await Promise.all([
        axios.get('https://financas-app-kappa.vercel.app/api/contas', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://financas-app-kappa.vercel.app/api/despesas', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://financas-app-kappa.vercel.app/api/estoque', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://financas-app-kappa.vercel.app/api/financiamentos', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://financas-app-kappa.vercel.app/api/metas', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://financas-app-kappa.vercel.app/api/orcamentos', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://financas-app-kappa.vercel.app/api/parcelamentos', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://financas-app-kappa.vercel.app/api/transacoes', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://financas-app-kappa.vercel.app/api/categorias', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setContas(contasResponse.data);
      setDespesas(despesasResponse.data);
      setEstoque(estoqueResponse.data);
      setFinanciamentos(financiamentosResponse.data);
      setMetas(metasResponse.data);
      setOrcamentos(orcamentosResponse.data);
      setParcelamentos(parcelamentosResponse.data);
      setTransacoes(transacoesResponse.data);
      setCategorias(categoriasResponse.data);

      // Calcular resumo
      const saldoTotal = contas.reduce((acc, conta) => acc + conta.saldo, 0);
      const receitasMes = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
      const despesasMes = transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);
      const transacoesRecentes = transacoes.slice(0, 5);

      setResumo({
        saldoTotal,
        receitasMes,
        despesasMes,
        transacoesRecentes
      });

      // Calcular dados para relatório
      const reportData = {
        resumoFinanceiro: {
          receita_total: receitasMes,
          despesa_total: despesasMes,
          saldo_total: saldoTotal
        },
        progressoMetas: metas.map(meta => ({
          descricao: meta.descricao,
          valor_atual: meta.valor_atual,
          valor_alvo: meta.valor_alvo
        })),
        desempenhoOrcamentos: orcamentos.map(orcamento => ({
          categoria: categorias.find(c => c._id === orcamento.categoria)?.nome || 'Desconhecida',
          valor_planejado: orcamento.valor_planejado,
          valor_atual: despesas.filter(d => d.categoria === orcamento.categoria).reduce((acc, d) => acc + d.valor, 0)
        }))
      };
      setReportData(reportData);

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      showAlert('Erro ao buscar dados', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const renderResumoFinanceiro = () => {
    const { saldoTotal, receitasMes, despesasMes } = resumo;
    return (
      <StyledCard $isDarkMode={isDarkMode}>
        <Card.Body>
          <Card.Title>Resumo Financeiro</Card.Title>
          <StyledRow>
            <StyledCol md={3}>
              <IconWrapper>
                <FontAwesomeIcon icon={faWallet} />
              </IconWrapper>
              <h5>Saldo Total</h5>
              <p className={saldoTotal >= 0 ? "text-success" : "text-danger"}>
                R$ {saldoTotal.toFixed(2)}
              </p>
            </StyledCol>
            <StyledCol md={3}>
              <IconWrapper>
                <FontAwesomeIcon icon={faChartLine} />
              </IconWrapper>
              <h5>Receitas do Período</h5>
              <p className="text-success">R$ {receitasMes.toFixed(2)}</p>
            </StyledCol>
            <StyledCol md={3}>
              <IconWrapper>
                <FontAwesomeIcon icon={faExchangeAlt} />
              </IconWrapper>
              <h5>Despesas do Período</h5>
              <p className="text-danger">R$ {despesasMes.toFixed(2)}</p>
            </StyledCol>
            <StyledCol md={3}>
              <IconWrapper>
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </IconWrapper>
              <h5>Saldo do Período</h5>
              <p className={receitasMes - despesasMes >= 0 ? "text-success" : "text-danger"}>
                R$ {(receitasMes - despesasMes).toFixed(2)}
              </p>
            </StyledCol>
          </StyledRow>
        </Card.Body>
      </StyledCard>
    );
  };

  const renderGraficos = () => {
    const fluxoCaixaData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      datasets: [
        {
          label: 'Receitas',
          data: new Array(12).fill(0).map((_, i) => 
            transacoes.filter(t => t.tipo === 'receita' && new Date(t.data).getMonth() === i)
              .reduce((acc, t) => acc + t.valor, 0)
          ),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Despesas',
          data: new Array(12).fill(0).map((_, i) => 
            transacoes.filter(t => t.tipo === 'despesa' && new Date(t.data).getMonth() === i)
              .reduce((acc, t) => acc + t.valor, 0)
          ),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    };

    const categoriasData = {
      labels: categorias.map(categoria => categoria.nome),
      datasets: [{
        data: categorias.map(categoria => 
          despesas.filter(despesa => despesa.categoria === categoria._id)
            .reduce((acc, curr) => acc + curr.valor, 0)
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      }]
    };

    const metasData = {
      labels: metas.map(meta => meta.descricao),
      datasets: [
        {
          label: 'Progresso',
          data: metas.map(meta => (meta.valor_atual / meta.valor_alvo) * 100),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }
      ]
    };

    const estoqueData = {
      labels: estoque.map(item => item.nome),
      datasets: [
        {
          label: 'Quantidade em Estoque',
          data: estoque.map(item => item.quantidade),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }
      ]
    };

    return (
      <StyledRow>
        <StyledCol md={6}>
          <StyledCard $isDarkMode={isDarkMode}>
            <Card.Body>
              <Card.Title>Fluxo de Caixa</Card.Title>
              <ChartContainer>
                <Line data={fluxoCaixaData} options={{ responsive: true, maintainAspectRatio: false }} />
              </ChartContainer>
            </Card.Body>
          </StyledCard>
        </StyledCol>
        <StyledCol md={6}>
          <StyledCard $isDarkMode={isDarkMode}>
            <Card.Body>
              <Card.Title>Despesas por Categoria</Card.Title>
              <ChartContainer>
                <Doughnut data={categoriasData} options={{ responsive: true, maintainAspectRatio: false }} />
              </ChartContainer>
            </Card.Body>
          </StyledCard>
        </StyledCol>
        <StyledCol md={6}>
          <StyledCard $isDarkMode={isDarkMode}>
            <Card.Body>
              <Card.Title>Progresso das Metas</Card.Title>
              <ChartContainer>
                <Bar data={metasData} options={{ responsive: true, maintainAspectRatio: false }} />
              </ChartContainer>
            </Card.Body>
          </StyledCard>
        </StyledCol>
        <StyledCol md={6}>
          <StyledCard $isDarkMode={isDarkMode}>
            <Card.Body>
              <Card.Title>Visão Geral do Estoque</Card.Title>
              <ChartContainer>
                <Bar data={estoqueData} options={{ responsive: true, maintainAspectRatio: false }} />
              </ChartContainer>
            </Card.Body>
          </StyledCard>
        </StyledCol>
      </StyledRow>
    );
  };

  const renderTransacoesRecentes = () => {
    return (
      <StyledCard $isDarkMode={isDarkMode}>
        <Card.Body>
          <Card.Title>Transações Recentes</Card.Title>
          <StyledTable striped bordered hover responsive $isDarkMode={isDarkMode}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {resumo.transacoesRecentes.length > 0 ? (
                resumo.transacoesRecentes.map((transacao, index) => (
                  <tr key={index}>
                    <td>{new Date(transacao.data).toLocaleDateString()}</td>
                    <td>{transacao.descricao}</td>
                    <td className={transacao.tipo === 'receita' ? 'text-success' : 'text-danger'}>
                      R$ {transacao.valor.toFixed(2)}
                    </td>
                    <td>{transacao.tipo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">Nenhuma transação recente</td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </Card.Body>
      </StyledCard>
    );
  };

  const renderReportModal = () => {
    return (
      <StyledModal 
        show={showReportModal} 
        onHide={() => setShowReportModal(false)} 
        size="lg"
        $isDarkMode={isDarkMode}
      >
        <Modal.Header closeButton>
          <Modal.Title>Relatório Financeiro Completo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reportData ? (
            <>
              <h5>Resumo Financeiro</h5>
              <p>Receita Total: R$ {reportData.resumoFinanceiro.receita_total.toFixed(2)}</p>
              <p>Despesa Total: R$ {reportData.resumoFinanceiro.despesa_total.toFixed(2)}</p>
              <p>Saldo Total: R$ {reportData.resumoFinanceiro.saldo_total.toFixed(2)}</p>

              <h5>Progresso das Metas</h5>
              <StyledTable striped bordered hover $isDarkMode={isDarkMode}>
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Valor Atual</th>
                    <th>Valor Alvo</th>
                    <th>Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.progressoMetas.map((meta, index) => (
                    <tr key={index}>
                      <td>{meta.descricao}</td>
                      <td>R$ {meta.valor_atual.toFixed(2)}</td>
                      <td>R$ {meta.valor_alvo.toFixed(2)}</td>
                      <td>{((meta.valor_atual / meta.valor_alvo) * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>

              <h5>Desempenho dos Orçamentos</h5>
              <StyledTable striped bordered hover $isDarkMode={isDarkMode}>
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Valor Planejado</th>
                    <th>Valor Atual</th>
                    <th>Diferença</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.desempenhoOrcamentos.map((orcamento, index) => (
                    <tr key={index}>
                      <td>{orcamento.categoria}</td>
                      <td>R$ {orcamento.valor_planejado.toFixed(2)}</td>
                      <td>R$ {orcamento.valor_atual.toFixed(2)}</td>
                      <td className={orcamento.valor_atual <= orcamento.valor_planejado ? 'text-success' : 'text-danger'}>
                        R$ {(orcamento.valor_planejado - orcamento.valor_atual).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </>
          ) : (
            <p>Carregando dados do relatório...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant={isDarkMode ? "light" : "secondary"} onClick={() => setShowReportModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </StyledModal>
    );
  };

  return (
    <Layout>
      <StyledContainer>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <StyledRow className="mb-4">
          <Col>
            <h2>Dashboard</h2>
          </Col>
          <Col xs="auto">
            <Form>
              <StyledDatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-control"
              />
              <StyledDatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-control"
              />
              <StyledButton variant="primary" onClick={fetchData} disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <><FontAwesomeIcon icon={faSync} className="mr-2" /> Atualizar Dados</>
                )}
              </StyledButton>
              <StyledButton variant="secondary" onClick={() => setShowReportModal(true)}>
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                Ver Relatório Completo
              </StyledButton>
            </Form>
          </Col>
        </StyledRow>

        {renderResumoFinanceiro()}
        {renderGraficos()}
        {renderTransacoesRecentes()}
        {renderReportModal()}
      </StyledContainer>
    </Layout>
  );
};

export default HomePage;

