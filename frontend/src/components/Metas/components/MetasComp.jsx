import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faChartLine, faTasks } from '@fortawesome/free-solid-svg-icons';
import { Pie, Bar } from 'react-chartjs-2';
import { MetasStyles } from '../styles/MetasStyles';
import { useMetas } from '../utils/MetasUtils';
import { useTheme } from '../../../shared/contexts/ThemeContext';

const MetasComp = () => {
  const { isDarkMode } = useTheme();
  const {
    metas,
    estatisticas,
    formData,
    isLoading,
    error,
    showModal,
    showDetailsModal,
    showProgressoModal,
    detailsMeta,
    alert,
    filtro,
    ordenacao,
    handleChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSave,
    handleShowDetails,
    handleShowProgressoModal,
    handleAtualizarProgresso,
    setShowModal,
    setShowDetailsModal,
    setShowProgressoModal,
    setFiltro,
    setOrdenacao,
    calcularProgresso,
    getProgressBarVariant,
    formatCurrency,
    formatDate
  } = useMetas();

  // Gerar dados para o gráfico de pizza
  const pieChartData = useMemo(() => {
    if (!metas || metas.length === 0) return null;

    const categorias = {};
    metas.forEach(meta => {
      if (!meta.categoria) return;
      
      if (categorias[meta.categoria]) {
        categorias[meta.categoria] += 1;
      } else {
        categorias[meta.categoria] = 1;
      }
    });

    // Gerar cores para o gráfico
    const generateColors = (count) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 137) % 360; // Distribuição de cores usando sequência de Fibonacci
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
      return colors;
    };

    const labels = Object.keys(categorias);
    const data = Object.values(categorias);
    const backgroundColor = generateColors(labels.length);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 1,
        },
      ],
    };
  }, [metas]);

  // Gerar dados para o gráfico de barras
  const barChartData = useMemo(() => {
    if (!metas || metas.length === 0) return null;

    // Selecionar apenas 5 metas para o gráfico
    const metasParaGrafico = [...metas]
      .sort((a, b) => b.valor_alvo - a.valor_alvo)
      .slice(0, 5);

    return {
      labels: metasParaGrafico.map(meta => meta.descricao.substring(0, 15) + (meta.descricao.length > 15 ? '...' : '')),
      datasets: [
        {
          label: 'Valor Atual',
          data: metasParaGrafico.map(meta => meta.valor_atual),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Valor Alvo',
          data: metasParaGrafico.map(meta => meta.valor_alvo),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    };
  }, [metas]);

  // Opções para os gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#fff' : '#333',
        },
      },
      title: {
        display: true,
        text: 'Progresso por Meta',
        color: isDarkMode ? '#fff' : '#333',
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#fff' : '#333',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? '#fff' : '#333',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#fff' : '#333',
        },
      },
      title: {
        display: true,
        text: 'Metas por Categoria',
        color: isDarkMode ? '#fff' : '#333',
      },
    },
  };

  // Renderizar estatísticas de metas
  const renderEstatisticas = () => {
    if (!estatisticas) return null;

    return (
      <Row className="mb-4">
        <Col md={3}>
          <MetasStyles.StatCard isDarkMode={isDarkMode}>
            <h3>{estatisticas.totalMetas || 0}</h3>
            <p>Total de Metas</p>
          </MetasStyles.StatCard>
        </Col>
        <Col md={3}>
          <MetasStyles.StatCard isDarkMode={isDarkMode}>
            <h3>{estatisticas.metasConcluidas || 0}</h3>
            <p>Metas Concluídas</p>
          </MetasStyles.StatCard>
        </Col>
        <Col md={3}>
          <MetasStyles.StatCard isDarkMode={isDarkMode}>
            <h3>{estatisticas.metasEmAndamento || 0}</h3>
            <p>Metas em Andamento</p>
          </MetasStyles.StatCard>
        </Col>
        <Col md={3}>
          <MetasStyles.StatCard isDarkMode={isDarkMode}>
            <h3>{formatCurrency(estatisticas.valorTotalMetas || 0)}</h3>
            <p>Valor Total</p>
          </MetasStyles.StatCard>
        </Col>
      </Row>
    );
  };

  // Renderizar gráficos
  const renderGraficos = () => {
    if (!pieChartData || !barChartData) return null;

    return (
      <Row className="mb-4">
        <Col md={6}>
          <MetasStyles.StyledCard isDarkMode={isDarkMode}>
            <Card.Body>
              <Card.Title>Metas por Categoria</Card.Title>
              <MetasStyles.ChartContainer>
                <Pie data={pieChartData} options={pieOptions} />
              </MetasStyles.ChartContainer>
            </Card.Body>
          </MetasStyles.StyledCard>
        </Col>
        <Col md={6}>
          <MetasStyles.StyledCard isDarkMode={isDarkMode}>
            <Card.Body>
              <Card.Title>Principais Metas</Card.Title>
              <MetasStyles.ChartContainer>
                <Bar data={barChartData} options={chartOptions} />
              </MetasStyles.ChartContainer>
            </Card.Body>
          </MetasStyles.StyledCard>
        </Col>
      </Row>
    );
  };

  return (
    <MetasStyles.StyledContainer isDarkMode={isDarkMode}>
      {alert.show && (
        <Alert variant={alert.variant} className="mt-3">
          {alert.message}
        </Alert>
      )}

      <Row className="align-items-center mb-4">
        <Col>
          <h2><FontAwesomeIcon icon={faTasks} className="me-2" />Gerenciamento de Metas</h2>
        </Col>
        <Col xs="auto">
          <MetasStyles.ResponsiveButton
            variant="primary"
            onClick={handleAdd}
            isDarkMode={isDarkMode}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Nova Meta
          </MetasStyles.ResponsiveButton>
        </Col>
      </Row>

      {/* Estatísticas */}
      {renderEstatisticas()}

      {/* Gráficos */}
      {renderGraficos()}

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filtrar metas:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Pesquisar por descrição ou categoria..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Ordenar por:</Form.Label>
            <Form.Select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <option value="data_limite">Data Limite</option>
              <option value="progresso">Progresso</option>
              <option value="valor_alvo">Valor Alvo</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Lista de Metas */}
      <MetasStyles.StyledCard isDarkMode={isDarkMode}>
        <Card.Body>
          <Card.Title>Lista de Metas</Card.Title>
          {isLoading ? (
            <p>Carregando metas...</p>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : metas.length === 0 ? (
            <p>Nenhuma meta encontrada.</p>
          ) : (
            <MetasStyles.StyledTable isDarkMode={isDarkMode} responsive>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Progresso</th>
                  <th>Valor Atual</th>
                  <th>Valor Alvo</th>
                  <th>Data Limite</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {metas.map((meta) => {
                  const progresso = calcularProgresso(meta.valor_atual, meta.valor_alvo);
                  const variant = getProgressBarVariant(meta);
                  
                  return (
                    <tr key={meta.id}>
                      <td>{meta.descricao}</td>
                      <td>
                        <Badge bg="info">{meta.categoria || 'Sem categoria'}</Badge>
                        {meta.recorrente && (
                          <Badge bg="warning" className="ms-1">Recorrente</Badge>
                        )}
                      </td>
                      <td style={{ width: '15%' }}>
                        <MetasStyles.StyledProgressBar
                          now={progresso > 100 ? 100 : progresso}
                          label={`${Math.round(progresso)}%`}
                          variant={variant}
                          isDarkMode={isDarkMode}
                        />
                      </td>
                      <td>{formatCurrency(meta.valor_atual)}</td>
                      <td>{formatCurrency(meta.valor_alvo)}</td>
                      <td>{formatDate(meta.data_limite)}</td>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => handleShowProgressoModal(meta)}
                          title="Atualizar Progresso"
                        >
                          <FontAwesomeIcon icon={faChartLine} />
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => handleShowDetails(meta)}
                          title="Ver Detalhes"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => handleEdit(meta)}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => handleDelete(meta.id)}
                          title="Excluir"
                          className="text-danger"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </MetasStyles.StyledTable>
          )}
        </Card.Body>
      </MetasStyles.StyledCard>

      {/* Modal de Adição/Edição */}
      <MetasStyles.StyledModal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        isDarkMode={isDarkMode}
      >
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? 'Editar Meta' : 'Nova Meta'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Valor Alvo (R$)</Form.Label>
                  <Form.Control
                    type="text"
                    name="valor_alvo"
                    value={formData.valor_alvo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Valor Atual (R$)</Form.Label>
                  <Form.Control
                    type="text"
                    name="valor_atual"
                    value={formData.valor_atual}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Data Limite</Form.Label>
                  <Form.Control
                    type="date"
                    name="data_limite"
                    value={formData.data_limite}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Meta Recorrente"
                name="recorrente"
                checked={formData.recorrente}
                onChange={handleChange}
              />
            </Form.Group>

            {formData.recorrente && (
              <Form.Group className="mb-3">
                <Form.Label>Período de Recorrência</Form.Label>
                <Form.Select
                  name="periodo_recorrencia"
                  value={formData.periodo_recorrencia}
                  onChange={handleChange}
                >
                  <option value="">Selecione...</option>
                  <option value="mensal">Mensal</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </MetasStyles.StyledModal>

      {/* Modal de Detalhes */}
      <MetasStyles.StyledModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
        isDarkMode={isDarkMode}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Meta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsMeta && (
            <>
              <h4>{detailsMeta.descricao}</h4>
              <p><strong>Categoria:</strong> {detailsMeta.categoria || 'Sem categoria'}</p>
              <p><strong>Valor Atual:</strong> {formatCurrency(detailsMeta.valor_atual)}</p>
              <p><strong>Valor Alvo:</strong> {formatCurrency(detailsMeta.valor_alvo)}</p>
              <p><strong>Data Limite:</strong> {formatDate(detailsMeta.data_limite)}</p>
              <p>
                <strong>Progresso:</strong> {Math.round(calcularProgresso(detailsMeta.valor_atual, detailsMeta.valor_alvo))}%
              </p>
              <MetasStyles.StyledProgressBar
                now={calcularProgresso(detailsMeta.valor_atual, detailsMeta.valor_alvo)}
                variant={getProgressBarVariant(detailsMeta)}
                isDarkMode={isDarkMode}
              />
              {detailsMeta.recorrente && (
                <p><strong>Recorrência:</strong> {detailsMeta.periodo_recorrencia}</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Fechar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowDetailsModal(false);
              if (detailsMeta) handleEdit(detailsMeta);
            }}
          >
            Editar
          </Button>
        </Modal.Footer>
      </MetasStyles.StyledModal>

      {/* Modal de Atualização de Progresso */}
      <MetasStyles.StyledModal
        show={showProgressoModal}
        onHide={() => setShowProgressoModal(false)}
        centered
        isDarkMode={isDarkMode}
      >
        <Modal.Header closeButton>
          <Modal.Title>Atualizar Progresso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsMeta && (
            <>
              <p><strong>Meta:</strong> {detailsMeta.descricao}</p>
              <p><strong>Valor Atual:</strong> {formatCurrency(detailsMeta.valor_atual)}</p>
              <p><strong>Valor Alvo:</strong> {formatCurrency(detailsMeta.valor_alvo)}</p>
              
              <Form.Group className="mb-3">
                <Form.Label>Novo Valor Atual (R$)</Form.Label>
                <Form.Control
                  type="text"
                  name="valor_atual"
                  value={formData.valor_atual}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProgressoModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAtualizarProgresso}>
            Atualizar
          </Button>
        </Modal.Footer>
      </MetasStyles.StyledModal>
    </MetasStyles.StyledContainer>
  );
};

export default MetasComp; 