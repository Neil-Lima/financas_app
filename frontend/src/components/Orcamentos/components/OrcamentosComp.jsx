import React from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faHistory, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import Layout from '../../../layout/Layout';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { OrcamentosStyles } from '../styles/OrcamentosStyles';
import { OrcamentosUtils } from '../utils/OrcamentosUtils';

const OrcamentosComp = () => {
  const { isDarkMode } = useTheme();
  const {
    orcamentos,
    categorias,
    despesas,
    formData,
    isLoading,
    error,
    showModal,
    showDetailsModal,
    detailsOrcamento,
    showHistoricoModal,
    historicoAnual,
    historicoCategoria,
    alert,
    editingId,
    handleChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSave,
    handleShowDetails,
    handleShowHistorico,
    setShowModal,
    setShowDetailsModal,
    setShowHistoricoModal,
    calcularValorAtual,
    calcularPorcentagemUso,
    getProgressBarVariant,
    getNomeMes,
    formatCurrency,
    showAlert
  } = OrcamentosUtils.useOrcamentos();

  // Função para gerar dados do gráfico de barras
  const gerarDadosGrafico = () => {
    if (orcamentos.length === 0) return null;

    // Agrupa orçamentos pelo mês e categoria
    const categoriasMeses = {};
    
    orcamentos.forEach(orcamento => {
      const categoriaId = orcamento.categoriaId;
      const categoria = categorias.find(c => c.id === categoriaId);
      const nomeMes = getNomeMes(orcamento.mes);
      
      if (!categoriasMeses[categoriaId]) {
        categoriasMeses[categoriaId] = {
          nome: categoria ? categoria.nome : 'Desconhecida',
          meses: {}
        };
      }
      
      categoriasMeses[categoriaId].meses[nomeMes] = {
        valorPlanejado: orcamento.valor_planejado,
        valorAtual: calcularValorAtual(categoriaId, orcamento.mes, orcamento.ano)
      };
    });
    
    // Organiza os dados para o gráfico
    const datasets = [];
    const labels = [];
    
    // Extrai todos os meses únicos
    Object.values(categoriasMeses).forEach(categoria => {
      Object.keys(categoria.meses).forEach(mes => {
        if (!labels.includes(mes)) labels.push(mes);
      });
    });
    
    // Ordena os meses
    const ordemMeses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    labels.sort((a, b) => ordemMeses.indexOf(a.toLowerCase()) - ordemMeses.indexOf(b.toLowerCase()));
    
    // Cria datasets para o gráfico
    const cores = [
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(255, 205, 86, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ];
    
    Object.values(categoriasMeses).forEach((categoria, index) => {
      const data = labels.map(mes => {
        if (categoria.meses[mes]) {
          return categoria.meses[mes].valorPlanejado;
        }
        return 0;
      });
      
      datasets.push({
        label: `${categoria.nome} (Planejado)`,
        data,
        backgroundColor: cores[index % cores.length],
        stack: `stack_${index}`
      });
      
      const dataAtual = labels.map(mes => {
        if (categoria.meses[mes]) {
          return categoria.meses[mes].valorAtual;
        }
        return 0;
      });
      
      datasets.push({
        label: `${categoria.nome} (Atual)`,
        data: dataAtual,
        backgroundColor: cores[index % cores.length].replace('0.7', '0.4'),
        borderColor: cores[index % cores.length].replace('0.7', '1'),
        borderWidth: 1,
        stack: `stack_${index}`
      });
    });
    
    return {
      labels,
      datasets
    };
  };

  const dadosGrafico = gerarDadosGrafico();

  return (
    <Layout>
      <OrcamentosStyles.StyledContainer fluid>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => showAlert('', '')} dismissible>
            {alert.message}
          </Alert>
        )}
        
        <Row className="mb-4">
          <Col>
            <h2>Gerenciamento de Orçamentos</h2>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Novo Orçamento
            </Button>
          </Col>
        </Row>
        
        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {/* Gráfico de orçamentos */}
            {dadosGrafico && (
              <OrcamentosStyles.StyledCard className="mb-4" isDarkMode={isDarkMode}>
                <div className="card-body">
                  <h5 className="card-title">Visão Geral dos Orçamentos</h5>
                  <OrcamentosStyles.ChartContainer>
                    <Bar 
                      data={dadosGrafico} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => formatCurrency(value)
                            }
                          }
                        },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                              }
                            }
                          }
                        }
                      }} 
                    />
                  </OrcamentosStyles.ChartContainer>
                </div>
              </OrcamentosStyles.StyledCard>
            )}
            
            {/* Lista de orçamentos */}
            <OrcamentosStyles.StyledCard isDarkMode={isDarkMode}>
              <div className="card-body">
                <h5 className="card-title">Orçamentos do Mês Atual</h5>
                <div className="table-responsive">
                  <OrcamentosStyles.StyledTable 
                    striped 
                    bordered 
                    hover 
                    isDarkMode={isDarkMode}
                    className={isDarkMode ? 'table-dark' : ''}
                  >
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Valor Planejado</th>
                        <th>Valor Atual</th>
                        <th>Progresso</th>
                        <th>Período</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orcamentos.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">Nenhum orçamento encontrado</td>
                        </tr>
                      ) : (
                        orcamentos.map(orcamento => {
                          const categoria = categorias.find(c => c.id === orcamento.categoriaId);
                          const valorAtual = calcularValorAtual(
                            orcamento.categoriaId, 
                            orcamento.mes, 
                            orcamento.ano
                          );
                          const porcentagemUso = calcularPorcentagemUso(
                            orcamento.valor_planejado, 
                            valorAtual
                          );
                          const progressVariant = getProgressBarVariant(porcentagemUso);
                          
                          return (
                            <tr key={orcamento.id}>
                              <td>{orcamento.descricao}</td>
                              <td>{categoria ? categoria.nome : 'N/A'}</td>
                              <td>{formatCurrency(orcamento.valor_planejado)}</td>
                              <td className={valorAtual > orcamento.valor_planejado ? 'text-danger' : ''}>
                                {formatCurrency(valorAtual)}
                              </td>
                              <td>
                                <OrcamentosStyles.StyledProgressBar 
                                  now={Math.min(porcentagemUso, 100)} 
                                  variant={progressVariant}
                                  label={`${porcentagemUso.toFixed(0)}%`}
                                />
                              </td>
                              <td>{`${getNomeMes(orcamento.mes)}/${orcamento.ano}`}</td>
                              <td>
                                <OrcamentosStyles.ResponsiveButton 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => handleEdit(orcamento)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </OrcamentosStyles.ResponsiveButton>
                                <OrcamentosStyles.ResponsiveButton 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDelete(orcamento.id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </OrcamentosStyles.ResponsiveButton>
                                <OrcamentosStyles.ResponsiveButton 
                                  variant="outline-info" 
                                  size="sm"
                                  onClick={() => handleShowDetails(orcamento)}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </OrcamentosStyles.ResponsiveButton>
                                <OrcamentosStyles.ResponsiveButton 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => handleShowHistorico(orcamento.categoriaId)}
                                >
                                  <FontAwesomeIcon icon={faHistory} />
                                </OrcamentosStyles.ResponsiveButton>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </OrcamentosStyles.StyledTable>
                </div>
              </div>
            </OrcamentosStyles.StyledCard>
          </>
        )}
        
        {/* Modal para adicionar/editar orçamento */}
        <OrcamentosStyles.StyledModal 
          show={showModal} 
          onHide={() => setShowModal(false)}
          isDarkMode={isDarkMode}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Editar Orçamento' : 'Novo Orçamento'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                      type="text"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                      placeholder="Digite a descrição"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Categoria</Form.Label>
                    <Form.Select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Valor Planejado</Form.Label>
                    <Form.Control
                      type="text"
                      name="valor_planejado"
                      value={formData.valor_planejado}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mês</Form.Label>
                    <Form.Select
                      name="mes"
                      value={formData.mes}
                      onChange={handleChange}
                      required
                    >
                      <option value="01">Janeiro</option>
                      <option value="02">Fevereiro</option>
                      <option value="03">Março</option>
                      <option value="04">Abril</option>
                      <option value="05">Maio</option>
                      <option value="06">Junho</option>
                      <option value="07">Julho</option>
                      <option value="08">Agosto</option>
                      <option value="09">Setembro</option>
                      <option value="10">Outubro</option>
                      <option value="11">Novembro</option>
                      <option value="12">Dezembro</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ano</Form.Label>
                    <Form.Control
                      type="number"
                      name="ano"
                      value={formData.ano}
                      onChange={handleChange}
                      placeholder="2023"
                      min="2000"
                      max="2100"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Observações</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleChange}
                      placeholder="Observações adicionais"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {formData.categoria && (
                <div className="alert alert-info">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  <strong>Dica:</strong> Planeje seus gastos com base no histórico de despesas na categoria selecionada.
                </div>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingId ? 'Atualizar' : 'Salvar'}
            </Button>
          </Modal.Footer>
        </OrcamentosStyles.StyledModal>
        
        {/* Modal de detalhes do orçamento */}
        <OrcamentosStyles.StyledModal 
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
                <h5>{detailsOrcamento.descricao}</h5>
                <hr />
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Categoria:</strong> {
                        categorias.find(c => c.id === detailsOrcamento.categoriaId)?.nome || 'N/A'
                      }
                    </p>
                    <p><strong>Valor Planejado:</strong> {formatCurrency(detailsOrcamento.valor_planejado)}</p>
                    <p>
                      <strong>Valor Atual:</strong> {
                        formatCurrency(calcularValorAtual(
                          detailsOrcamento.categoriaId, 
                          detailsOrcamento.mes, 
                          detailsOrcamento.ano
                        ))
                      }
                    </p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Período:</strong> {`${getNomeMes(detailsOrcamento.mes)}/${detailsOrcamento.ano}`}</p>
                    <p>
                      <strong>Progresso:</strong> {
                        calcularPorcentagemUso(
                          detailsOrcamento.valor_planejado, 
                          calcularValorAtual(
                            detailsOrcamento.categoriaId, 
                            detailsOrcamento.mes, 
                            detailsOrcamento.ano
                          )
                        ).toFixed(0)
                      }%
                    </p>
                    <OrcamentosStyles.StyledProgressBar 
                      now={Math.min(calcularPorcentagemUso(
                        detailsOrcamento.valor_planejado, 
                        calcularValorAtual(
                          detailsOrcamento.categoriaId, 
                          detailsOrcamento.mes, 
                          detailsOrcamento.ano
                        )
                      ), 100)} 
                      variant={getProgressBarVariant(calcularPorcentagemUso(
                        detailsOrcamento.valor_planejado, 
                        calcularValorAtual(
                          detailsOrcamento.categoriaId, 
                          detailsOrcamento.mes, 
                          detailsOrcamento.ano
                        )
                      ))}
                    />
                  </Col>
                </Row>
                
                {detailsOrcamento.observacoes && (
                  <>
                    <hr />
                    <h6>Observações</h6>
                    <p>{detailsOrcamento.observacoes}</p>
                  </>
                )}
                
                <hr />
                <h6>Status do Orçamento</h6>
                {calcularValorAtual(
                  detailsOrcamento.categoriaId, 
                  detailsOrcamento.mes, 
                  detailsOrcamento.ano
                ) > detailsOrcamento.valor_planejado ? (
                  <div className="alert alert-danger">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Este orçamento excedeu o valor planejado em {
                      formatCurrency(
                        calcularValorAtual(
                          detailsOrcamento.categoriaId, 
                          detailsOrcamento.mes, 
                          detailsOrcamento.ano
                        ) - detailsOrcamento.valor_planejado
                      )
                    }
                  </div>
                ) : (
                  <div className="alert alert-success">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Este orçamento está dentro do limite planejado. Restam {
                      formatCurrency(
                        detailsOrcamento.valor_planejado - calcularValorAtual(
                          detailsOrcamento.categoriaId, 
                          detailsOrcamento.mes, 
                          detailsOrcamento.ano
                        )
                      )
                    }
                  </div>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </OrcamentosStyles.StyledModal>
        
        {/* Modal de histórico anual */}
        <OrcamentosStyles.StyledModal 
          show={showHistoricoModal} 
          onHide={() => setShowHistoricoModal(false)}
          isDarkMode={isDarkMode}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Histórico Anual - {categorias.find(c => c.id === historicoCategoria)?.nome || 'Categoria'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {historicoAnual.length > 0 ? (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Mês</th>
                      <th>Ano</th>
                      <th>Valor Planejado</th>
                      <th>Valor Realizado</th>
                      <th>Diferença</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoAnual.map((item, index) => (
                      <tr key={index}>
                        <td>{getNomeMes(item.mes)}</td>
                        <td>{item.ano}</td>
                        <td>{formatCurrency(item.valor_planejado)}</td>
                        <td>{formatCurrency(item.valor_realizado)}</td>
                        <td>{formatCurrency(item.valor_planejado - item.valor_realizado)}</td>
                        <td>
                          {item.valor_realizado <= item.valor_planejado ? (
                            <span className="text-success">Dentro do orçamento</span>
                          ) : (
                            <span className="text-danger">Acima do orçamento</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p className="text-center">Nenhum dado histórico disponível para esta categoria.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowHistoricoModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </OrcamentosStyles.StyledModal>
      </OrcamentosStyles.StyledContainer>
    </Layout>
  );
};

export default OrcamentosComp; 