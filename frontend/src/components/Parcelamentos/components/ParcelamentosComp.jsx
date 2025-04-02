import React from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCalculator, faEye, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import Layout from '../../../layout/Layout';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { ParcelamentosStyles } from '../styles/ParcelamentosStyles';
import { ParcelamentosUtils } from '../utils/ParcelamentosUtils';

const ParcelamentosComp = () => {
  const { isDarkMode } = useTheme();
  const {
    parcelamentos,
    categorias,
    formData,
    isLoading,
    error,
    showModal,
    showDetailsModal,
    parcelasCalculadas,
    detailsParcelamento,
    alert,
    editingId,
    handleChange,
    handleEdit,
    handleAdd,
    handleDelete,
    handleSave,
    calcularParcelas,
    handleShowDetails,
    setShowModal,
    setShowDetailsModal,
    formatCurrency,
    formatDate,
    calcularValorParcela,
    calcularTotalComJuros,
    showAlert
  } = ParcelamentosUtils.useParcelamentos();

  // Dados para o gráfico de fluxo de parcelas
  const gerarDadosGrafico = () => {
    if (parcelamentos.length === 0) return null;

    // Agrupa valores por mês
    const dadosMensais = {};
    
    parcelamentos.forEach(parcelamento => {
      const numParcelas = parcelamento.num_parcelas;
      const valorParcela = calcularValorParcela(parcelamento.valor_total, numParcelas);
      const dataInicio = new Date(parcelamento.data_inicio);
      
      for (let i = 0; i < numParcelas; i++) {
        const dataParcela = new Date(dataInicio);
        dataParcela.setMonth(dataInicio.getMonth() + i);
        
        const chave = `${dataParcela.getMonth() + 1}/${dataParcela.getFullYear()}`;
        
        if (!dadosMensais[chave]) {
          dadosMensais[chave] = 0;
        }
        
        dadosMensais[chave] += valorParcela;
      }
    });
    
    // Ordena as chaves para exibir em ordem cronológica
    const chaves = Object.keys(dadosMensais).sort((a, b) => {
      const [mesA, anoA] = a.split('/').map(Number);
      const [mesB, anoB] = b.split('/').map(Number);
      
      if (anoA !== anoB) return anoA - anoB;
      return mesA - mesB;
    });
    
    // Limita a 12 meses para não sobrecarregar o gráfico
    const chavesFiltradas = chaves.slice(0, 12);
    
    return {
      labels: chavesFiltradas,
      datasets: [
        {
          label: 'Valor mensal das parcelas',
          data: chavesFiltradas.map(chave => dadosMensais[chave]),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  const dadosGrafico = gerarDadosGrafico();

  return (
    <Layout>
      <ParcelamentosStyles.StyledContainer fluid>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => showAlert('', '')} dismissible>
            {alert.message}
          </Alert>
        )}
        
        <Row className="mb-4">
          <Col>
            <h2>Gerenciamento de Parcelamentos</h2>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Novo Parcelamento
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
            {/* Gráfico de fluxo de parcelas */}
            {dadosGrafico && (
              <ParcelamentosStyles.StyledCard className="mb-4" isDarkMode={isDarkMode}>
                <div className="card-body">
                  <h5 className="card-title">Fluxo de Parcelas Mensais</h5>
                  <ParcelamentosStyles.ChartContainer>
                    <Line 
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
                  </ParcelamentosStyles.ChartContainer>
                </div>
              </ParcelamentosStyles.StyledCard>
            )}
            
            {/* Resumo dos parcelamentos */}
            <ParcelamentosStyles.StyledCard className="mb-4" isDarkMode={isDarkMode}>
              <div className="card-body">
                <h5 className="card-title">Resumo dos Parcelamentos</h5>
                <Row>
                  <Col md={4}>
                    <div className="d-flex flex-column align-items-center mb-3">
                      <h3>{parcelamentos.length}</h3>
                      <p className="text-muted">Total de Parcelamentos</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex flex-column align-items-center mb-3">
                      <h3>
                        {formatCurrency(
                          parcelamentos.reduce((total, p) => total + p.valor_total, 0)
                        )}
                      </h3>
                      <p className="text-muted">Valor Total</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex flex-column align-items-center mb-3">
                      <h3>
                        {formatCurrency(
                          parcelamentos.reduce((total, p) => {
                            const valorComJuros = calcularTotalComJuros(
                              p.valor_total, 
                              p.juros || 0, 
                              p.num_parcelas
                            );
                            return total + (valorComJuros - p.valor_total);
                          }, 0)
                        )}
                      </h3>
                      <p className="text-muted">Total em Juros</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </ParcelamentosStyles.StyledCard>
            
            {/* Lista de parcelamentos */}
            <ParcelamentosStyles.StyledCard isDarkMode={isDarkMode}>
              <div className="card-body">
                <h5 className="card-title">Lista de Parcelamentos</h5>
                <div className="table-responsive">
                  <ParcelamentosStyles.StyledTable 
                    striped 
                    bordered 
                    hover 
                    isDarkMode={isDarkMode}
                    className={isDarkMode ? 'table-dark' : ''}
                  >
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor Total</th>
                        <th>Parcelas</th>
                        <th>Valor da Parcela</th>
                        <th>Data de Início</th>
                        <th>Categoria</th>
                        <th>Juros</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parcelamentos.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center">Nenhum parcelamento encontrado</td>
                        </tr>
                      ) : (
                        parcelamentos.map(parcelamento => {
                          const categoria = categorias.find(c => c.id === parcelamento.categoriaId);
                          const valorParcela = calcularValorParcela(
                            parcelamento.valor_total, 
                            parcelamento.num_parcelas
                          );
                          
                          return (
                            <tr key={parcelamento.id}>
                              <td>{parcelamento.descricao}</td>
                              <td>{formatCurrency(parcelamento.valor_total)}</td>
                              <td>{parcelamento.num_parcelas}x</td>
                              <td>{formatCurrency(valorParcela)}</td>
                              <td>{formatDate(parcelamento.data_inicio)}</td>
                              <td>{categoria ? categoria.nome : 'N/A'}</td>
                              <td>{parcelamento.juros ? `${parcelamento.juros}%` : '0%'}</td>
                              <td>
                                <ParcelamentosStyles.ResponsiveButton 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => handleEdit(parcelamento)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </ParcelamentosStyles.ResponsiveButton>
                                <ParcelamentosStyles.ResponsiveButton 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDelete(parcelamento.id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </ParcelamentosStyles.ResponsiveButton>
                                <ParcelamentosStyles.ResponsiveButton 
                                  variant="outline-info" 
                                  size="sm"
                                  onClick={() => handleShowDetails(parcelamento)}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </ParcelamentosStyles.ResponsiveButton>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </ParcelamentosStyles.StyledTable>
                </div>
              </div>
            </ParcelamentosStyles.StyledCard>
          </>
        )}
        
        {/* Modal para adicionar/editar parcelamento */}
        <ParcelamentosStyles.StyledModal 
          show={showModal} 
          onHide={() => setShowModal(false)}
          isDarkMode={isDarkMode}
          backdrop="static"
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Editar Parcelamento' : 'Novo Parcelamento'}</Modal.Title>
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
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Valor Total</Form.Label>
                    <Form.Control
                      type="text"
                      name="valor_total"
                      value={formData.valor_total}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de Parcelas</Form.Label>
                    <Form.Control
                      type="number"
                      name="num_parcelas"
                      value={formData.num_parcelas}
                      onChange={handleChange}
                      placeholder="1"
                      min="1"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Juros (% ao mês)</Form.Label>
                    <Form.Control
                      type="text"
                      name="juros"
                      value={formData.juros}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data de Início</Form.Label>
                    <Form.Control
                      type="date"
                      name="data_inicio"
                      value={formData.data_inicio}
                      onChange={handleChange}
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
              
              {formData.valor_total && formData.num_parcelas && (
                <div className="alert alert-info">
                  <p className="mb-0">
                    <FontAwesomeIcon icon={faCalculator} className="me-2" />
                    <strong>Valor da parcela:</strong> {
                      formatCurrency(calcularValorParcela(
                        parseFloat(formData.valor_total), 
                        parseInt(formData.num_parcelas)
                      ))
                    }
                  </p>
                  {parseFloat(formData.juros) > 0 && (
                    <p className="mb-0 mt-2">
                      <FontAwesomeIcon icon={faExclamation} className="me-2" />
                      <strong>Total com juros:</strong> {
                        formatCurrency(calcularTotalComJuros(
                          parseFloat(formData.valor_total),
                          parseFloat(formData.juros),
                          parseInt(formData.num_parcelas)
                        ))
                      }
                    </p>
                  )}
                </div>
              )}
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  {editingId ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button variant="info" onClick={calcularParcelas}>
                  <FontAwesomeIcon icon={faCalculator} className="me-2" />
                  Calcular Parcelas
                </Button>
              </div>
              
              {parcelasCalculadas.length > 0 && (
                <div className="mt-4">
                  <h5>Detalhamento das Parcelas</h5>
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Data</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parcelasCalculadas.map((parcela, index) => (
                          <tr key={index}>
                            <td>{parcela.numero}</td>
                            <td>{formatDate(parcela.data)}</td>
                            <td>{formatCurrency(parcela.valor)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </Form>
          </Modal.Body>
        </ParcelamentosStyles.StyledModal>
        
        {/* Modal de detalhes do parcelamento */}
        <ParcelamentosStyles.StyledModal 
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
                <h5>{detailsParcelamento.descricao}</h5>
                <hr />
                <Row>
                  <Col md={6}>
                    <p><strong>Valor Total:</strong> {formatCurrency(detailsParcelamento.valor_total)}</p>
                    <p><strong>Número de Parcelas:</strong> {detailsParcelamento.num_parcelas}</p>
                    <p>
                      <strong>Valor da Parcela:</strong> {
                        formatCurrency(calcularValorParcela(
                          detailsParcelamento.valor_total, 
                          detailsParcelamento.num_parcelas
                        ))
                      }
                    </p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Data de Início:</strong> {formatDate(detailsParcelamento.data_inicio)}</p>
                    <p>
                      <strong>Categoria:</strong> {
                        categorias.find(c => c.id === detailsParcelamento.categoriaId)?.nome || 'N/A'
                      }
                    </p>
                    <p><strong>Juros:</strong> {detailsParcelamento.juros ? `${detailsParcelamento.juros}%` : '0%'}</p>
                  </Col>
                </Row>
                
                {detailsParcelamento.observacoes && (
                  <>
                    <hr />
                    <h6>Observações</h6>
                    <p>{detailsParcelamento.observacoes}</p>
                  </>
                )}
                
                {detailsParcelamento.juros > 0 && (
                  <>
                    <hr />
                    <h6>Valores com Juros</h6>
                    <p>
                      <strong>Total a Pagar com Juros:</strong> {
                        formatCurrency(calcularTotalComJuros(
                          detailsParcelamento.valor_total,
                          detailsParcelamento.juros,
                          detailsParcelamento.num_parcelas
                        ))
                      }
                    </p>
                    <p>
                      <strong>Total de Juros:</strong> {
                        formatCurrency(
                          calcularTotalComJuros(
                            detailsParcelamento.valor_total,
                            detailsParcelamento.juros,
                            detailsParcelamento.num_parcelas
                          ) - detailsParcelamento.valor_total
                        )
                      }
                    </p>
                  </>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Fechar
            </Button>
          </Modal.Footer>
        </ParcelamentosStyles.StyledModal>
      </ParcelamentosStyles.StyledContainer>
    </Layout>
  );
};

export default ParcelamentosComp; 