import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faChartLine, faExchangeAlt, faMoneyBillWave, faFileAlt, faSync } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { Line, Doughnut } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StyledContainer = styled(Container)`
  padding: 20px;
`;

const StyledCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
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
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  background-color: ${props => props.isDarkMode ? '#1e1e1e' : '#ffffff'};

  th, td {
    border-color: ${props => props.isDarkMode ? '#444' : '#dee2e6'};
    padding: 12px;
    background-color: ${props => props.isDarkMode ? '#1e1e1e' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  }

  tbody tr:nth-of-type(odd) {
    background-color: ${props => props.isDarkMode ? '#2a2a2a' : '#f8f9fa'};
  }

  tbody tr:hover {
    background-color: ${props => props.isDarkMode ? '#3a3a3a' : '#e9ecef'};
  }

  .text-success {
    color: ${props => props.isDarkMode ? '#4caf50' : '#28a745'} !important;
  }

  .text-danger {
    color: ${props => props.isDarkMode ? '#f44336' : '#dc3545'} !important;
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
    background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  }

  .modal-header {
    border-bottom-color: ${props => props.isDarkMode ? '#444' : '#dee2e6'};
  }

  .modal-footer {
    border-top-color: ${props => props.isDarkMode ? '#444' : '#dee2e6'};
  }

  .close {
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [resumoResponse, reportResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/resumo', {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
        }),
        axios.get('http://localhost:5000/api/relatorios/completo', {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
        })
      ]);
      setResumo(resumoResponse.data);
      setReportData(reportResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResumoFinanceiro = () => {
    const { saldoTotal, receitasMes, despesasMes } = resumo;
    return (
      <StyledCard isDarkMode={isDarkMode}>
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
    const emptyData = {
      labels: [],
      datasets: [{ data: [] }]
    };

    const fluxoCaixaData = reportData ? {
      labels: reportData.fluxoCaixa.map(item => item.mes),
      datasets: [
        {
          label: 'Receitas',
          data: reportData.fluxoCaixa.map(item => item.receitas),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Despesas',
          data: reportData.fluxoCaixa.map(item => item.despesas),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    } : emptyData;

    const categoriasData = reportData ? {
      labels: reportData.transacoesPorCategoria.map(item => item.categoria),
      datasets: [{
        data: reportData.transacoesPorCategoria.map(item => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      }]
    } : emptyData;

    return (
      <StyledRow>
        <StyledCol md={6}>
          <StyledCard isDarkMode={isDarkMode}>
            <Card.Body>
              <Card.Title>Fluxo de Caixa</Card.Title>
              <ChartContainer>
                <Line data={fluxoCaixaData} options={{ responsive: true, maintainAspectRatio: false }} />
              </ChartContainer>
            </Card.Body>
          </StyledCard>
        </StyledCol>
        <StyledCol md={6}>
          <StyledCard isDarkMode={isDarkMode}>
            <Card.Body>
              <Card.Title>Transações por Categoria</Card.Title>
              <ChartContainer>
                <Doughnut data={categoriasData} options={{ responsive: true, maintainAspectRatio: false }} />
              </ChartContainer>
            </Card.Body>
          </StyledCard>
        </StyledCol>
      </StyledRow>
    );
  };

  const renderTransacoesRecentes = () => {
    return (
      <StyledCard isDarkMode={isDarkMode}>
        <Card.Body>
          <Card.Title>Transações Recentes</Card.Title>
          <StyledTable striped bordered hover responsive isDarkMode={isDarkMode}>
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
        isDarkMode={isDarkMode}
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
              <StyledTable striped bordered hover isDarkMode={isDarkMode}>
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
              <StyledTable striped bordered hover isDarkMode={isDarkMode}>
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
        <StyledRow className="mb-4">
          <Col>
            <h2>Dashboard</h2>
          </Col>
          <Col xs="auto">
            <Form inline>
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
