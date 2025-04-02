import React from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faEye, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import Layout from '../../../layout/Layout';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { FinanciamentosStyles } from '../styles/FinanciamentosStyles';
import { FinanciamentosUtils } from '../utils/FinanciamentosUtils';

const FinanciamentosComp = () => {
  const { isDarkMode } = useTheme();
  const {
    financiamentos,
    newFinanciamento,
    editingId,
    editedFinanciamento,
    showDetailsModal,
    detailsFinanciamento,
    showParcelasModal,
    parcelasCalculadas,
    alert,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleCloseDetailsModal,
    handleShowParcelas,
    handleCloseParcelasModal,
    formatDate,
    calcularValorParcela,
    calcularTotalPagar,
    calcularTotalJuros,
    getChartData,
    chartOptions,
    setEditingId,
    setAlert
  } = FinanciamentosUtils.useFinanciamentosLogic();

  return (
    <Layout>
      <FinanciamentosStyles.StyledContainer fluid>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <h2>Gerenciamento de Financiamentos</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <FinanciamentosStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Adicionar Novo Financiamento</Card.Title>
                <FinanciamentosStyles.ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <FinanciamentosStyles.ResponsiveCol xs={12} md={12}>
                      <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          type="text"
                          name="descricao"
                          value={newFinanciamento.descricao}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </FinanciamentosStyles.ResponsiveCol>
                    <FinanciamentosStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Valor Total (R$)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          name="valor_total"
                          value={newFinanciamento.valor_total}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </FinanciamentosStyles.ResponsiveCol>
                    <FinanciamentosStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Taxa de Juros (% ao mês)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          name="taxa_juros"
                          value={newFinanciamento.taxa_juros}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </FinanciamentosStyles.ResponsiveCol>
                    <FinanciamentosStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Número de Parcelas</Form.Label>
                        <Form.Control
                          type="number"
                          step="1"
                          min="1"
                          name="parcelas_totais"
                          value={newFinanciamento.parcelas_totais}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </FinanciamentosStyles.ResponsiveCol>
                    <FinanciamentosStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Data de Início</Form.Label>
                        <Form.Control
                          type="date"
                          name="data_inicio"
                          value={newFinanciamento.data_inicio}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </FinanciamentosStyles.ResponsiveCol>
                  </Row>
                  <Button variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Adicionar Financiamento
                  </Button>
                </FinanciamentosStyles.ResponsiveForm>
              </Card.Body>
            </FinanciamentosStyles.StyledCard>
          </Col>

          <Col md={6}>
            <FinanciamentosStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Valor Principal vs Juros</Card.Title>
                <FinanciamentosStyles.ChartContainer>
                  {financiamentos.length > 0 ? (
                    <Bar data={getChartData()} options={chartOptions} />
                  ) : (
                    <div className="text-center py-4">
                      <p>Sem dados suficientes para gerar o gráfico</p>
                    </div>
                  )}
                </FinanciamentosStyles.ChartContainer>
              </Card.Body>
            </FinanciamentosStyles.StyledCard>
          </Col>
        </Row>

        <Row>
          <Col>
            <FinanciamentosStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Lista de Financiamentos</Card.Title>
                <div className="table-responsive">
                  <FinanciamentosStyles.StyledTable striped bordered hover isDarkMode={isDarkMode}>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor Total</th>
                        <th>Taxa de Juros</th>
                        <th>Parcelas</th>
                        <th>Valor da Parcela</th>
                        <th>Total a Pagar</th>
                        <th>Data de Início</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financiamentos.map((financiamento) => (
                        <tr key={financiamento._id}>
                          <td>
                            {editingId === financiamento._id ? (
                              <Form.Control
                                type="text"
                                name="descricao"
                                value={editedFinanciamento.descricao}
                                onChange={handleEditChange}
                              />
                            ) : (
                              financiamento.descricao
                            )}
                          </td>
                          <td>
                            {editingId === financiamento._id ? (
                              <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                name="valor_total"
                                value={editedFinanciamento.valor_total}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${parseFloat(financiamento.valor_total).toFixed(2)}`
                            )}
                          </td>
                          <td>
                            {editingId === financiamento._id ? (
                              <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                name="taxa_juros"
                                value={editedFinanciamento.taxa_juros}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `${parseFloat(financiamento.taxa_juros).toFixed(2)}%`
                            )}
                          </td>
                          <td>
                            {editingId === financiamento._id ? (
                              <Form.Control
                                type="number"
                                step="1"
                                min="1"
                                name="parcelas_totais"
                                value={editedFinanciamento.parcelas_totais}
                                onChange={handleEditChange}
                              />
                            ) : (
                              financiamento.parcelas_totais
                            )}
                          </td>
                          <td>
                            R$ {calcularValorParcela(financiamento).toFixed(2)}
                          </td>
                          <td>
                            R$ {calcularTotalPagar(financiamento).toFixed(2)}
                          </td>
                          <td>
                            {editingId === financiamento._id ? (
                              <Form.Control
                                type="date"
                                name="data_inicio"
                                value={editedFinanciamento.data_inicio}
                                onChange={handleEditChange}
                              />
                            ) : (
                              formatDate(financiamento.data_inicio)
                            )}
                          </td>
                          <td>
                            {editingId === financiamento._id ? (
                              <>
                                <FinanciamentosStyles.ResponsiveButton
                                  variant="success"
                                  size="sm"
                                  onClick={handleSaveEdit}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </FinanciamentosStyles.ResponsiveButton>
                                <FinanciamentosStyles.ResponsiveButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setEditingId(null)}
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </FinanciamentosStyles.ResponsiveButton>
                              </>
                            ) : (
                              <>
                                <FinanciamentosStyles.ResponsiveButton
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleShowDetails(financiamento)}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </FinanciamentosStyles.ResponsiveButton>
                                <FinanciamentosStyles.ResponsiveButton
                                  variant="warning"
                                  size="sm"
                                  onClick={() => handleEdit(financiamento)}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </FinanciamentosStyles.ResponsiveButton>
                                <FinanciamentosStyles.ResponsiveButton
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(financiamento._id)}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </FinanciamentosStyles.ResponsiveButton>
                                <FinanciamentosStyles.ResponsiveButton
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleShowParcelas(financiamento)}
                                >
                                  <FontAwesomeIcon icon={faCalculator} />
                                </FinanciamentosStyles.ResponsiveButton>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </FinanciamentosStyles.StyledTable>
                </div>
              </Card.Body>
            </FinanciamentosStyles.StyledCard>
          </Col>
        </Row>

        {/* Modal de Detalhes */}
        <FinanciamentosStyles.StyledModal
          show={showDetailsModal}
          onHide={handleCloseDetailsModal}
          isDarkMode={isDarkMode}
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalhes do Financiamento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsFinanciamento && (
              <div>
                <p><strong>Descrição:</strong> {detailsFinanciamento.descricao}</p>
                <p><strong>Valor Total:</strong> R$ {parseFloat(detailsFinanciamento.valor_total).toFixed(2)}</p>
                <p><strong>Taxa de Juros:</strong> {parseFloat(detailsFinanciamento.taxa_juros).toFixed(2)}% ao mês</p>
                <p><strong>Número de Parcelas:</strong> {detailsFinanciamento.parcelas_totais}</p>
                <p><strong>Valor da Parcela:</strong> R$ {calcularValorParcela(detailsFinanciamento).toFixed(2)}</p>
                <p><strong>Total a Pagar:</strong> R$ {calcularTotalPagar(detailsFinanciamento).toFixed(2)}</p>
                <p><strong>Total de Juros:</strong> R$ {calcularTotalJuros(detailsFinanciamento).toFixed(2)}</p>
                <p><strong>Data de Início:</strong> {formatDate(detailsFinanciamento.data_inicio)}</p>
                {detailsFinanciamento.createdAt && (
                  <p><strong>Criado em:</strong> {new Date(detailsFinanciamento.createdAt).toLocaleString()}</p>
                )}
                {detailsFinanciamento.updatedAt && (
                  <p><strong>Última atualização:</strong> {new Date(detailsFinanciamento.updatedAt).toLocaleString()}</p>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetailsModal}>
              Fechar
            </Button>
          </Modal.Footer>
        </FinanciamentosStyles.StyledModal>

        {/* Modal de Parcelas */}
        <FinanciamentosStyles.StyledModal
          show={showParcelasModal}
          onHide={handleCloseParcelasModal}
          isDarkMode={isDarkMode}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Simulação de Parcelas - {detailsFinanciamento && detailsFinanciamento.descricao}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-responsive">
              <FinanciamentosStyles.StyledTable striped bordered hover isDarkMode={isDarkMode}>
                <thead>
                  <tr>
                    <th>Parcela</th>
                    <th>Valor da Parcela</th>
                    <th>Juros</th>
                    <th>Amortização</th>
                    <th>Saldo Devedor</th>
                  </tr>
                </thead>
                <tbody>
                  {parcelasCalculadas.map((parcela) => (
                    <tr key={parcela.numero}>
                      <td>{parcela.numero}</td>
                      <td>R$ {parcela.valorParcela.toFixed(2)}</td>
                      <td>R$ {parcela.juros.toFixed(2)}</td>
                      <td>R$ {parcela.amortizacao.toFixed(2)}</td>
                      <td>R$ {parcela.saldoDevedor.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </FinanciamentosStyles.StyledTable>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseParcelasModal}>
              Fechar
            </Button>
          </Modal.Footer>
        </FinanciamentosStyles.StyledModal>
      </FinanciamentosStyles.StyledContainer>
    </Layout>
  );
};

export default FinanciamentosComp; 