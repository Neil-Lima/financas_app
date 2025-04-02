import React, { useMemo } from 'react';
import { Row, Col, Card, Button, Form, Alert, Table, Modal, Spinner } from 'react-bootstrap';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel, faChartBar, faCalendarAlt, faFilter, faSync } from '@fortawesome/free-solid-svg-icons';
import { RelatoriosStyles } from '../styles/RelatoriosStyles';
import { useRelatorios } from '../utils/RelatoriosUtils';
import { useTheme } from '../../../shared/contexts/ThemeContext';

const RelatoriosComp = () => {
  const { isDarkMode } = useTheme();
  const {
    transacoes,
    relatorioData,
    tipoRelatorio,
    categorias,
    filtros,
    isLoading,
    error,
    alert,
    showModal,
    setShowModal,
    setTipoRelatorio,
    handleFilterChange,
    setPeriodoAtual,
    setPeriodoAnterior,
    gerarRelatorio,
    exportarPDF,
    exportarExcel,
    formatCurrency,
    formatDate,
    calcularTotais,
    prepararDadosGraficoCategorias,
    prepararDadosGraficoEvolucao
  } = useRelatorios();

  // Memoizar dados para gráficos
  const dadosDespesasPorCategoria = useMemo(() => prepararDadosGraficoCategorias(), [prepararDadosGraficoCategorias]);
  const dadosEvolucaoMensal = useMemo(() => prepararDadosGraficoEvolucao(), [prepararDadosGraficoEvolucao]);
  const { totalReceitas, totalDespesas, saldo } = useMemo(() => calcularTotais(), [calcularTotais]);

  // Opções para gráficos
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDarkMode ? '#fff' : '#333',
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'Despesas por Categoria',
        color: isDarkMode ? '#fff' : '#333',
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#fff' : '#333',
        }
      },
      title: {
        display: true,
        text: 'Comparativo Mensal',
        color: isDarkMode ? '#fff' : '#333',
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#333',
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value) => formatCurrency(value),
          color: isDarkMode ? '#fff' : '#333',
        }
      }
    }
  };

  // Renderizar filtros
  const renderFiltros = () => (
    <RelatoriosStyles.FilterContainer isDarkMode={isDarkMode}>
      <Row className="w-100">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Data Inicial</Form.Label>
            <Form.Control
              type="date"
              value={filtros.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Data Final</Form.Label>
            <Form.Control
              type="date"
              value={filtros.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              value={filtros.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              value={filtros.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
            >
              <option value="">Todas</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row className="w-100 mt-3">
        <Col md={6}>
          <div className="d-flex gap-2">
            <RelatoriosStyles.ResponsiveButton
              variant="outline-secondary"
              onClick={setPeriodoAtual}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
              Mês Atual
            </RelatoriosStyles.ResponsiveButton>
            <RelatoriosStyles.ResponsiveButton
              variant="outline-secondary"
              onClick={setPeriodoAnterior}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
              Mês Anterior
            </RelatoriosStyles.ResponsiveButton>
          </div>
        </Col>
        <Col md={6}>
          <div className="d-flex justify-content-end gap-2">
            <Form.Select 
              style={{ maxWidth: '200px' }}
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
            >
              <option value="resumo">Resumo Financeiro</option>
              <option value="fluxo-caixa">Fluxo de Caixa</option>
              <option value="despesas-categoria">Despesas por Categoria</option>
              <option value="evolucao-patrimonial">Evolução Patrimonial</option>
            </Form.Select>
            <RelatoriosStyles.ResponsiveButton
              variant="primary"
              onClick={gerarRelatorio}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Carregando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faChartBar} className="me-2" />
                  Gerar Relatório
                </>
              )}
            </RelatoriosStyles.ResponsiveButton>
          </div>
        </Col>
      </Row>
    </RelatoriosStyles.FilterContainer>
  );

  // Renderizar resumo
  const renderResumo = () => (
    <Row className="mb-4">
      <Col md={4}>
        <RelatoriosStyles.StatCard isDarkMode={isDarkMode} color={isDarkMode ? '#2c4c7c' : '#e6f7ff'}>
          <h3>{formatCurrency(totalReceitas)}</h3>
          <p>Total de Receitas</p>
        </RelatoriosStyles.StatCard>
      </Col>
      <Col md={4}>
        <RelatoriosStyles.StatCard isDarkMode={isDarkMode} color={isDarkMode ? '#4c2c4c' : '#ffe6e6'}>
          <h3>{formatCurrency(totalDespesas)}</h3>
          <p>Total de Despesas</p>
        </RelatoriosStyles.StatCard>
      </Col>
      <Col md={4}>
        <RelatoriosStyles.StatCard 
          isDarkMode={isDarkMode} 
          color={saldo >= 0 
            ? (isDarkMode ? '#2c4c3c' : '#e6fff2') 
            : (isDarkMode ? '#4c2c3c' : '#ffe6e9')}
        >
          <h3>{formatCurrency(saldo)}</h3>
          <p>Saldo</p>
        </RelatoriosStyles.StatCard>
      </Col>
    </Row>
  );

  // Renderizar gráficos
  const renderGraficos = () => (
    <Row className="mb-4">
      <Col md={6}>
        <RelatoriosStyles.StyledCard isDarkMode={isDarkMode}>
          <Card.Body>
            <Card.Title>Despesas por Categoria</Card.Title>
            {dadosDespesasPorCategoria.labels.length > 0 ? (
              <RelatoriosStyles.ChartContainer>
                <Pie data={dadosDespesasPorCategoria} options={pieOptions} />
              </RelatoriosStyles.ChartContainer>
            ) : (
              <div className="text-center p-5">
                <p>Não há dados para exibir</p>
              </div>
            )}
          </Card.Body>
        </RelatoriosStyles.StyledCard>
      </Col>
      <Col md={6}>
        <RelatoriosStyles.StyledCard isDarkMode={isDarkMode}>
          <Card.Body>
            <Card.Title>Transações no Período</Card.Title>
            <div className="d-flex justify-content-around">
              <div className="text-center">
                <h5>Receitas</h5>
                <h3 className="text-success">{transacoes.filter(t => t.tipo === 'receita').length}</h3>
              </div>
              <div className="text-center">
                <h5>Despesas</h5>
                <h3 className="text-danger">{transacoes.filter(t => t.tipo === 'despesa').length}</h3>
              </div>
              <div className="text-center">
                <h5>Total</h5>
                <h3>{transacoes.length}</h3>
              </div>
            </div>
          </Card.Body>
        </RelatoriosStyles.StyledCard>
      </Col>
    </Row>
  );

  // Renderizar lista de transações
  const renderTransacoes = () => (
    <RelatoriosStyles.StyledCard isDarkMode={isDarkMode}>
      <Card.Body>
        <Card.Title>Transações no Período</Card.Title>
        {transacoes.length === 0 ? (
          <p className="text-center">Nenhuma transação encontrada para o período selecionado.</p>
        ) : (
          <RelatoriosStyles.StyledTable isDarkMode={isDarkMode} responsive striped hover>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{formatDate(transacao.data)}</td>
                  <td>{transacao.descricao}</td>
                  <td>{transacao.categoria}</td>
                  <td>
                    <span className={transacao.tipo === 'receita' ? 'text-success' : 'text-danger'}>
                      {transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td>{formatCurrency(transacao.valor)}</td>
                </tr>
              ))}
            </tbody>
          </RelatoriosStyles.StyledTable>
        )}
      </Card.Body>
    </RelatoriosStyles.StyledCard>
  );

  // Renderizar modal de relatório
  const renderRelatorioModal = () => (
    <RelatoriosStyles.StyledModal
      size="lg"
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      isDarkMode={isDarkMode}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {tipoRelatorio === 'resumo' && 'Resumo Financeiro'}
          {tipoRelatorio === 'fluxo-caixa' && 'Fluxo de Caixa'}
          {tipoRelatorio === 'despesas-categoria' && 'Despesas por Categoria'}
          {tipoRelatorio === 'evolucao-patrimonial' && 'Evolução Patrimonial'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <p className="mb-3">
              <strong>Período:</strong> {formatDate(filtros.startDate)} a {formatDate(filtros.endDate)}
            </p>
            
            {tipoRelatorio === 'resumo' && relatorioData && (
              <>
                <Row className="mb-4">
                  <Col md={4}>
                    <RelatoriosStyles.StatCard isDarkMode={isDarkMode} color={isDarkMode ? '#2c4c7c' : '#e6f7ff'}>
                      <h3>{formatCurrency(relatorioData.totalReceitas)}</h3>
                      <p>Total de Receitas</p>
                    </RelatoriosStyles.StatCard>
                  </Col>
                  <Col md={4}>
                    <RelatoriosStyles.StatCard isDarkMode={isDarkMode} color={isDarkMode ? '#4c2c4c' : '#ffe6e6'}>
                      <h3>{formatCurrency(relatorioData.totalDespesas)}</h3>
                      <p>Total de Despesas</p>
                    </RelatoriosStyles.StatCard>
                  </Col>
                  <Col md={4}>
                    <RelatoriosStyles.StatCard 
                      isDarkMode={isDarkMode} 
                      color={relatorioData.saldo >= 0 
                        ? (isDarkMode ? '#2c4c3c' : '#e6fff2') 
                        : (isDarkMode ? '#4c2c3c' : '#ffe6e9')}
                    >
                      <h3>{formatCurrency(relatorioData.saldo)}</h3>
                      <p>Saldo</p>
                    </RelatoriosStyles.StatCard>
                  </Col>
                </Row>
                
                {relatorioData.categoriasTop && (
                  <div className="mb-4">
                    <h5>Maiores Despesas por Categoria</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Categoria</th>
                          <th>Valor</th>
                          <th>% do Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {relatorioData.categoriasTop.map((cat, index) => (
                          <tr key={index}>
                            <td>{cat.categoria}</td>
                            <td>{formatCurrency(cat.valor)}</td>
                            <td>{cat.percentual.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </>
            )}
            
            {tipoRelatorio === 'fluxo-caixa' && relatorioData && (
              <>
                <h5 className="mb-3">Fluxo de Caixa Diário</h5>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Receitas</th>
                      <th>Despesas</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioData.fluxoDiario.map((dia, index) => (
                      <tr key={index}>
                        <td>{formatDate(dia.data)}</td>
                        <td className="text-success">{formatCurrency(dia.receitas)}</td>
                        <td className="text-danger">{formatCurrency(dia.despesas)}</td>
                        <td className={dia.saldo >= 0 ? 'text-success' : 'text-danger'}>
                          {formatCurrency(dia.saldo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                
                <RelatoriosStyles.ChartContainer className="mt-4">
                  {relatorioData.fluxoDiario.length > 0 && (
                    <Line
                      data={{
                        labels: relatorioData.fluxoDiario.map(dia => formatDate(dia.data)),
                        datasets: [
                          {
                            label: 'Receitas',
                            data: relatorioData.fluxoDiario.map(dia => dia.receitas),
                            borderColor: 'rgba(40, 167, 69, 1)',
                            backgroundColor: 'rgba(40, 167, 69, 0.1)',
                            tension: 0.4
                          },
                          {
                            label: 'Despesas',
                            data: relatorioData.fluxoDiario.map(dia => dia.despesas),
                            borderColor: 'rgba(220, 53, 69, 1)',
                            backgroundColor: 'rgba(220, 53, 69, 0.1)',
                            tension: 0.4
                          },
                          {
                            label: 'Saldo',
                            data: relatorioData.fluxoDiario.map(dia => dia.saldo),
                            borderColor: 'rgba(0, 123, 255, 1)',
                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                            tension: 0.4
                          }
                        ]
                      }}
                      options={barOptions}
                    />
                  )}
                </RelatoriosStyles.ChartContainer>
              </>
            )}
            
            {tipoRelatorio === 'despesas-categoria' && relatorioData && (
              <>
                <h5 className="mb-3">Despesas por Categoria</h5>
                <RelatoriosStyles.ChartContainer className="mb-4">
                  {relatorioData.categorias && relatorioData.categorias.length > 0 && (
                    <Pie
                      data={{
                        labels: relatorioData.categorias.map(cat => cat.categoria),
                        datasets: [
                          {
                            data: relatorioData.categorias.map(cat => cat.valor),
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.7)',
                              'rgba(54, 162, 235, 0.7)',
                              'rgba(255, 206, 86, 0.7)',
                              'rgba(75, 192, 192, 0.7)',
                              'rgba(153, 102, 255, 0.7)',
                              'rgba(255, 159, 64, 0.7)',
                              'rgba(199, 199, 199, 0.7)',
                              'rgba(83, 102, 255, 0.7)',
                              'rgba(40, 159, 64, 0.7)',
                              'rgba(210, 199, 199, 0.7)'
                            ]
                          }
                        ]
                      }}
                      options={pieOptions}
                    />
                  )}
                </RelatoriosStyles.ChartContainer>
                
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Valor</th>
                      <th>% do Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioData.categorias.map((cat, index) => (
                      <tr key={index}>
                        <td>{cat.categoria}</td>
                        <td>{formatCurrency(cat.valor)}</td>
                        <td>{cat.percentual.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
            
            {tipoRelatorio === 'evolucao-patrimonial' && relatorioData && (
              <>
                <h5 className="mb-3">Evolução Patrimonial</h5>
                <RelatoriosStyles.ChartContainer className="mb-4">
                  {relatorioData.evolucaoMensal && relatorioData.evolucaoMensal.length > 0 && (
                    <Bar data={dadosEvolucaoMensal} options={barOptions} />
                  )}
                </RelatoriosStyles.ChartContainer>
                
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Mês/Ano</th>
                      <th>Receitas</th>
                      <th>Despesas</th>
                      <th>Saldo</th>
                      <th>Patrimônio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioData.evolucaoMensal.map((mes, index) => (
                      <tr key={index}>
                        <td>{mes.mes}</td>
                        <td className="text-success">{formatCurrency(mes.receitas)}</td>
                        <td className="text-danger">{formatCurrency(mes.despesas)}</td>
                        <td className={mes.saldo >= 0 ? 'text-success' : 'text-danger'}>
                          {formatCurrency(mes.saldo)}
                        </td>
                        <td>{formatCurrency(mes.patrimonio)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <RelatoriosStyles.ReportButtonsContainer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
          <Button variant="success" onClick={exportarExcel} disabled={isLoading}>
            <FontAwesomeIcon icon={faFileExcel} className="me-2" />
            Exportar Excel
          </Button>
          <Button variant="danger" onClick={exportarPDF} disabled={isLoading}>
            <FontAwesomeIcon icon={faFilePdf} className="me-2" />
            Exportar PDF
          </Button>
        </RelatoriosStyles.ReportButtonsContainer>
      </Modal.Footer>
    </RelatoriosStyles.StyledModal>
  );

  return (
    <RelatoriosStyles.StyledContainer isDarkMode={isDarkMode}>
      {alert.show && (
        <Alert variant={alert.variant} className="mt-3">
          {alert.message}
        </Alert>
      )}

      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="mt-3">
            <FontAwesomeIcon icon={faChartBar} className="me-2" />
            Relatórios
          </h2>
          <p className="text-muted">
            Visualize e analise seus dados financeiros para o período selecionado.
          </p>
        </Col>
      </Row>

      {renderFiltros()}
      
      {error ? (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      ) : (
        <>
          {renderResumo()}
          {renderGraficos()}
          {renderTransacoes()}
          {renderRelatorioModal()}
        </>
      )}
    </RelatoriosStyles.StyledContainer>
  );
};

export default RelatoriosComp; 