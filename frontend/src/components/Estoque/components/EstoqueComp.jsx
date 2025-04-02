import React from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import Layout from '../../../layout/Layout';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { EstoqueStyles } from '../styles/EstoqueStyles';
import { EstoqueUtils } from '../utils/EstoqueUtils';

const EstoqueComp = () => {
  const { isDarkMode } = useTheme();
  const {
    filteredItems,
    categorias,
    newItem,
    editingId,
    editedItem,
    showDetailsModal,
    detailsItem,
    alert,
    searchTerm,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleCloseDetailsModal,
    handleSearch,
    calcularValorTotal,
    calcularValorTotalEstoque,
    getChartData,
    chartOptions,
    setEditingId,
    setAlert
  } = EstoqueUtils.useEstoqueLogic();

  return (
    <Layout>
      <EstoqueStyles.StyledContainer fluid>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <h2>Gerenciamento de Estoque</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <EstoqueStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Adicionar Novo Item</Card.Title>
                <EstoqueStyles.ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <EstoqueStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Nome do Produto</Form.Label>
                        <Form.Control
                          type="text"
                          name="nome_produto"
                          value={newItem.nome_produto}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </EstoqueStyles.ResponsiveCol>
                    <EstoqueStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control
                          type="number"
                          step="1"
                          min="0"
                          name="quantidade"
                          value={newItem.quantidade}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </EstoqueStyles.ResponsiveCol>
                    <EstoqueStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Preço Unitário (R$)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          name="preco_unitario"
                          value={newItem.preco_unitario}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </EstoqueStyles.ResponsiveCol>
                    <EstoqueStyles.ResponsiveCol xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                          as="select"
                          name="categoria"
                          value={newItem.categoria}
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
                    </EstoqueStyles.ResponsiveCol>
                  </Row>
                  <Button variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Adicionar Item
                  </Button>
                </EstoqueStyles.ResponsiveForm>
              </Card.Body>
            </EstoqueStyles.StyledCard>
          </Col>

          <Col md={6}>
            <EstoqueStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Valor do Estoque por Categoria</Card.Title>
                <EstoqueStyles.ChartContainer>
                  {categorias.length > 0 && filteredItems.length > 0 ? (
                    <Bar data={getChartData()} options={chartOptions} />
                  ) : (
                    <div className="text-center py-4">
                      <p>Sem dados suficientes para gerar o gráfico</p>
                    </div>
                  )}
                </EstoqueStyles.ChartContainer>
              </Card.Body>
            </EstoqueStyles.StyledCard>
          </Col>
        </Row>

        <Row>
          <Col>
            <EstoqueStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <span>Lista de Itens em Estoque</span>
                  <span>Valor Total: R$ {calcularValorTotalEstoque().toFixed(2)}</span>
                </Card.Title>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="search-addon">
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar por nome ou categoria..."
                    value={searchTerm}
                    onChange={handleSearch}
                    aria-label="Buscar"
                    aria-describedby="search-addon"
                  />
                </InputGroup>
                <div className="table-responsive">
                  <EstoqueStyles.StyledTable striped bordered hover isDarkMode={isDarkMode}>
                    <thead>
                      <tr>
                        <th>Nome do Produto</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Valor Total</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item) => (
                        <tr key={item._id}>
                          <td>
                            {editingId === item._id ? (
                              <Form.Control
                                type="text"
                                name="nome_produto"
                                value={editedItem.nome_produto}
                                onChange={handleEditChange}
                              />
                            ) : (
                              item.nome_produto
                            )}
                          </td>
                          <td>
                            {editingId === item._id ? (
                              <Form.Control
                                type="number"
                                step="1"
                                min="0"
                                name="quantidade"
                                value={editedItem.quantidade}
                                onChange={handleEditChange}
                              />
                            ) : (
                              item.quantidade
                            )}
                          </td>
                          <td>
                            {editingId === item._id ? (
                              <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                name="preco_unitario"
                                value={editedItem.preco_unitario}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${parseFloat(item.preco_unitario).toFixed(2)}`
                            )}
                          </td>
                          <td>R$ {calcularValorTotal(item).toFixed(2)}</td>
                          <td>
                            {editingId === item._id ? (
                              <Form.Control
                                as="select"
                                name="categoria"
                                value={editedItem.categoria || ''}
                                onChange={handleEditChange}
                              >
                                <option value="">Selecione uma categoria</option>
                                {categorias.map((categoria) => (
                                  <option key={categoria._id} value={categoria._id}>
                                    {categoria.nome}
                                  </option>
                                ))}
                              </Form.Control>
                            ) : (
                              item.categoria ? item.categoria.nome : 'N/A'
                            )}
                          </td>
                          <td>
                            {editingId === item._id ? (
                              <>
                                <EstoqueStyles.ResponsiveButton
                                  variant="success"
                                  size="sm"
                                  onClick={handleSaveEdit}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </EstoqueStyles.ResponsiveButton>
                                <EstoqueStyles.ResponsiveButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setEditingId(null)}
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </EstoqueStyles.ResponsiveButton>
                              </>
                            ) : (
                              <>
                                <EstoqueStyles.ResponsiveButton
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleShowDetails(item)}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </EstoqueStyles.ResponsiveButton>
                                <EstoqueStyles.ResponsiveButton
                                  variant="warning"
                                  size="sm"
                                  onClick={() => handleEdit(item)}
                                  className="me-1"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </EstoqueStyles.ResponsiveButton>
                                <EstoqueStyles.ResponsiveButton
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(item._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </EstoqueStyles.ResponsiveButton>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </EstoqueStyles.StyledTable>
                </div>
              </Card.Body>
            </EstoqueStyles.StyledCard>
          </Col>
        </Row>

        <EstoqueStyles.StyledModal
          show={showDetailsModal}
          onHide={handleCloseDetailsModal}
          isDarkMode={isDarkMode}
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalhes do Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsItem && (
              <div>
                <p><strong>Nome do Produto:</strong> {detailsItem.nome_produto}</p>
                <p><strong>Quantidade:</strong> {detailsItem.quantidade}</p>
                <p><strong>Preço Unitário:</strong> R$ {parseFloat(detailsItem.preco_unitario).toFixed(2)}</p>
                <p><strong>Valor Total:</strong> R$ {calcularValorTotal(detailsItem).toFixed(2)}</p>
                <p><strong>Categoria:</strong> {detailsItem.categoria ? detailsItem.categoria.nome : 'N/A'}</p>
                {detailsItem.createdAt && (
                  <p><strong>Criado em:</strong> {new Date(detailsItem.createdAt).toLocaleString()}</p>
                )}
                {detailsItem.updatedAt && (
                  <p><strong>Última atualização:</strong> {new Date(detailsItem.updatedAt).toLocaleString()}</p>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetailsModal}>
              Fechar
            </Button>
          </Modal.Footer>
        </EstoqueStyles.StyledModal>
      </EstoqueStyles.StyledContainer>
    </Layout>
  );
};

export default EstoqueComp; 