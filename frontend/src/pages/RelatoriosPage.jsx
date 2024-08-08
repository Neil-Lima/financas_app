import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faFileDownload
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import Layout from '../layout/Layout';
import axios from 'axios';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const StyledCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const RelatoriosPage = () => {
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [relatorio, setRelatorio] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dataInicial') setDataInicial(value);
    if (name === 'dataFinal') setDataFinal(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/relatorios/completo?dataInicio=${dataInicial}&dataFim=${dataFinal}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRelatorio(response.data);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/relatorios/pdf?dataInicio=${dataInicial}&dataFim=${dataFinal}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio_financeiro.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    }
  };

  const renderResumoFinanceiro = () => {
    if (!relatorio || !relatorio.resumoFinanceiro) return null;
    const { receita_total, despesa_total, saldo_total } = relatorio.resumoFinanceiro;
    return (
      <StyledCard className="mb-4">
        <Card.Body>
          <Card.Title>Resumo Financeiro</Card.Title>
          <Row>
            <Col md={4}>
              <h5>Receita Total</h5>
              <p className="text-success">R$ {receita_total.toFixed(2)}</p>
            </Col>
            <Col md={4}>
              <h5>Despesa Total</h5>
              <p className="text-danger">R$ {despesa_total.toFixed(2)}</p>
            </Col>
            <Col md={4}>
              <h5>Saldo Total</h5>
              <p className={saldo_total >= 0 ? "text-success" : "text-danger"}>R$ {saldo_total.toFixed(2)}</p>
            </Col>
          </Row>
        </Card.Body>
      </StyledCard>
    );
  };

  const renderTransacoesPorCategoria = () => {
    if (!relatorio || !relatorio.transacoesPorCategoria) return null;
    const data = {
      labels: relatorio.transacoesPorCategoria.map(item => item.categoria),
      datasets: [{
        data: relatorio.transacoesPorCategoria.map(item => item.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      }]
    };
    return (
      <StyledCard className="mb-4">
        <Card.Body>
          <Card.Title>Transações por Categoria</Card.Title>
          <ChartContainer>
            <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
          </ChartContainer>
        </Card.Body>
      </StyledCard>
    );
  };

  const renderFluxoCaixa = () => {
    if (!relatorio || !relatorio.fluxoCaixa) return null;
    const data = {
      labels: relatorio.fluxoCaixa.map(item => item.mes),
      datasets: [
        {
          label: 'Receitas',
          data: relatorio.fluxoCaixa.map(item => item.receitas),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Despesas',
          data: relatorio.fluxoCaixa.map(item => item.despesas),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    };
    return (
      <StyledCard className="mb-4">
        <Card.Body>
          <Card.Title>Fluxo de Caixa</Card.Title>
          <ChartContainer>
            <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
          </ChartContainer>
        </Card.Body>
      </StyledCard>
    );
  };

  const renderProgressoMetas = () => {
    if (!relatorio || !relatorio.progressoMetas) return null;
    return (
      <StyledCard className="mb-4">
        <Card.Body>
          <Card.Title>Progresso das Metas</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor Atual</th>
                <th>Valor Alvo</th>
                <th>Progresso</th>
              </tr>
            </thead>
            <tbody>
              {relatorio.progressoMetas.map((meta, index) => (
                <tr key={index}>
                  <td>{meta.descricao}</td>
                  <td>R$ {meta.valor_atual.toFixed(2)}</td>
                  <td>R$ {meta.valor_alvo.toFixed(2)}</td>
                  <td>
                    <div className="progress">
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{width: `${(meta.valor_atual / meta.valor_alvo) * 100}%`}}
                        aria-valuenow={(meta.valor_atual / meta.valor_alvo) * 100}
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      >
                        {((meta.valor_atual / meta.valor_alvo) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </StyledCard>
    );
  };

  const renderDesempenhoOrcamentos = () => {
    if (!relatorio || !relatorio.desempenhoOrcamentos) return null;
    const data = {
      labels: relatorio.desempenhoOrcamentos.map(item => item.categoria),
      datasets: [
        {
          label: 'Valor Planejado',
          data: relatorio.desempenhoOrcamentos.map(item => item.valor_planejado),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Valor Atual',
          data: relatorio.desempenhoOrcamentos.map(item => item.valor_atual),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }
      ]
    };
    return (
      <StyledCard className="mb-4">
        <Card.Body>
          <Card.Title>Desempenho dos Orçamentos</Card.Title>
          <ChartContainer>
            <Bar 
              data={data} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </ChartContainer>
        </Card.Body>
      </StyledCard>
    );
  };

  return (
    <Layout>
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h2>Relatórios Financeiros</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <StyledCard>
              <Card.Body>
                <Card.Title>Gerar Relatório</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Data Inicial</Form.Label>
                        <Form.Control 
                          type="date" 
                          name="dataInicial" 
                          value={dataInicial} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Data Final</Form.Label>
                        <Form.Control 
                          type="date" 
                          name="dataFinal" 
                          value={dataFinal} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button variant="primary" type="submit" className="w-100">
                        <FontAwesomeIcon icon={faSearch} className="mr-2" /> Gerar Relatório
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        {relatorio && (
          <>
            {renderResumoFinanceiro()}
            {renderTransacoesPorCategoria()}
            {renderFluxoCaixa()}
            {renderProgressoMetas()}
            {renderDesempenhoOrcamentos()}
            <Row>
              <Col className="text-center">
                <Button variant="success" onClick={handleDownloadPDF}>
                  <FontAwesomeIcon icon={faFileDownload} className="mr-2" /> Baixar Relatório em PDF
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default RelatoriosPage;
