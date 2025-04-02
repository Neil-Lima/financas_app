import React from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import Layout from '../../../layout/Layout';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { DespesasStyles } from '../styles/DespesasStyles';
import { DespesasUtils } from '../utils/DespesasUtils';

const DespesasComp = () => {
  const { isDarkMode } = useTheme();
  const {
    despesas,
    categorias,
    newDespesa,
    editingId,
    editedDespesa,
    showDetailsModal,
    detailsDespesa,
    alert,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleCloseDetailsModal,
    getChartData,
    chartOptions,
    setAlert
  } = DespesasUtils.useDespesasLogic();

  return (
    <Layout>
      <DespesasStyles.StyledContainer fluid>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <h2>Gerenciamento de Despesas</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <DespesasStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Adicionar Nova Despesa</Card.Title>
                <DespesasStyles.ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <DespesasStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          type="text"
                          name="descricao"
                          value={newDespesa.descricao}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </DespesasStyles.ResponsiveCol>
                    <DespesasStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Valor (R$)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          name="valor"
                          value={newDespesa.valor}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </DespesasStyles.ResponsiveCol>
                    <DespesasStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="date"
                          name="data"
                          value={newDespesa.data}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </DespesasStyles.ResponsiveCol>
                    <DespesasStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                          as="select"
                          name="categoria"
                          value={newDespesa.categoria}
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
                    </DespesasStyles.ResponsiveCol>
                  </Row>
                  <Button variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Adicionar Despesa
                  </Button>
                </DespesasStyles.ResponsiveForm>
              </Card.Body>
            </DespesasStyles.StyledCard>
          </Col>

          <Col md={6}>
            <DespesasStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Despesas por Categoria</Card.Title>
                <DespesasStyles.ChartContainer>
                  {categorias.length > 0 && despesas.length > 0 && (
                    <Bar data={getChartData()} options={chartOptions} />
                  )}
                  {(categorias.length === 0 || despesas.length === 0) && (
                    <div className="text-center py-4">
                      <p>Sem dados suficientes para gerar o gráfico</p>
                    </div>
                  )}
                </DespesasStyles.ChartContainer>
              </Card.Body>
            </DespesasStyles.StyledCard>
          </Col>
        </Row>

        <Row>
          <Col>
            <DespesasStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Lista de Despesas</Card.Title>
                <div className="table-responsive">
                  <DespesasStyles.StyledTable striped bordered hover isDarkMode={isDarkMode}>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {despesas.map((despesa) => (
                        <tr key={despesa._id}>
                          <td>
                            {editingId === despesa._id ? (
                              <Form.Control
                                type="text"
                                name="descricao"
                                value={editedDespesa.descricao}
                                onChange={handleEditChange}
                              />
                            ) : (
                              despesa.descricao
                            )}
                          </td>
                          <td>
                            {editingId === despesa._id ? (
                              <Form.Control
                                type="number"
                                step="0.01"
                                name="valor"
                                value={editedDespesa.valor}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${parseFloat(despesa.valor).toFixed(2)}`
                            )}
                          </td>
                          <td>
                            {editingId === despesa._id ? (
                              <Form.Control
                                type="date"
                                name="data"
                                value={editedDespesa.data ? new Date(editedDespesa.data).toISOString().split('T')[0] : ''}
                                onChange={handleEditChange}
                              />
                            ) : (
                              new Date(despesa.data).toLocaleDateString()
                            )}
                          </td>
                          <td>
                            {editingId === despesa._id ? (
                              <Form.Control
                                as="select"
                                name="categoria"
                                value={editedDespesa.categoria && editedDespesa.categoria._id ? editedDespesa.categoria._id : (editedDespesa.categoria || '')}
                                onChange={handleEditChange}
                              >
                                {categorias.map((categoria) => (
                                  <option key={categoria._id} value={categoria._id}>
                                    {categoria.nome}
                                  </option>
                                ))}
                              </Form.Control>
                            ) : (
                              despesa.categoria ? despesa.categoria.nome : 'N/A'
                            )}
                          </td>
                          <td>
                            {editingId === despesa._id ? (
                              <>
                                <DespesasStyles.ResponsiveButton
                                  variant="success"
                                  size="sm"
                                  onClick={handleSaveEdit}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </DespesasStyles.ResponsiveButton>
                                <DespesasStyles.ResponsiveButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setEditingId(null)}
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </DespesasStyles.ResponsiveButton>
                              </>
                            ) : (
                              <>
                                <DespesasStyles.ResponsiveButton
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleShowDetails(despesa)}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </DespesasStyles.ResponsiveButton>
                                <DespesasStyles.ResponsiveButton
                                  variant="warning"
                                  size="sm"
                                  onClick={() => handleEdit(despesa)}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </DespesasStyles.ResponsiveButton>
                                <DespesasStyles.ResponsiveButton
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(despesa._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </DespesasStyles.ResponsiveButton>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </DespesasStyles.StyledTable>
                </div>
              </Card.Body>
            </DespesasStyles.StyledCard>
          </Col>
        </Row>

        <DespesasStyles.StyledModal
          show={showDetailsModal}
          onHide={handleCloseDetailsModal}
          isDarkMode={isDarkMode}
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalhes da Despesa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsDespesa && (
              <div>
                <p><strong>Descrição:</strong> {detailsDespesa.descricao}</p>
                <p><strong>Valor:</strong> R$ {parseFloat(detailsDespesa.valor).toFixed(2)}</p>
                <p><strong>Data:</strong> {new Date(detailsDespesa.data).toLocaleDateString()}</p>
                <p><strong>Categoria:</strong> {detailsDespesa.categoria ? detailsDespesa.categoria.nome : 'N/A'}</p>
                {detailsDespesa.createdAt && (
                  <p><strong>Criado em:</strong> {new Date(detailsDespesa.createdAt).toLocaleString()}</p>
                )}
                {detailsDespesa.updatedAt && (
                  <p><strong>Última atualização:</strong> {new Date(detailsDespesa.updatedAt).toLocaleString()}</p>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetailsModal}>
              Fechar
            </Button>
          </Modal.Footer>
        </DespesasStyles.StyledModal>
      </DespesasStyles.StyledContainer>
    </Layout>
  );
};

export default DespesasComp; 