import React from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import Layout from '../../../layout/Layout';
import { ContasStyles } from '../styles/ContasStyles';
import { ContasUtils } from '../utils/ContasUtils';

const ContasComp = () => {
  const { isDarkMode } = useTheme();
  const {
    contas,
    newConta,
    editingId,
    editedConta,
    showDetailsModal,
    detailsConta,
    alert,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    handleShowDetails,
    handleCloseDetailsModal,
    formatDate
  } = ContasUtils.useContasLogic();

  return (
    <Layout>
      <ContasStyles.StyledContainer fluid>
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
            {alert.message}
          </Alert>
        )}

        <Row className="mb-4">
          <Col>
            <h2>Contas</h2>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <ContasStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Nova Conta</Card.Title>
                <ContasStyles.ResponsiveForm onSubmit={handleSubmit}>
                  <Row>
                    <ContasStyles.ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                          type="text"
                          name="nome"
                          value={newConta.nome}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ContasStyles.ResponsiveCol>
                    <ContasStyles.ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Saldo</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          name="saldo"
                          value={newConta.saldo}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ContasStyles.ResponsiveCol>
                    <ContasStyles.ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                          as="select"
                          name="tipo"
                          value={newConta.tipo}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione...</option>
                          <option value="Corrente">Corrente</option>
                          <option value="Poupança">Poupança</option>
                          <option value="Investimento">Investimento</option>
                          <option value="Carteira">Carteira</option>
                        </Form.Control>
                      </Form.Group>
                    </ContasStyles.ResponsiveCol>
                    <ContasStyles.ResponsiveCol xs={12} md={3}>
                      <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          type="date"
                          name="data"
                          value={newConta.data}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </ContasStyles.ResponsiveCol>
                  </Row>
                  <Button variant="primary" type="submit" className="mt-3">
                    <FontAwesomeIcon icon={faPlus} /> Adicionar Conta
                  </Button>
                </ContasStyles.ResponsiveForm>
              </Card.Body>
            </ContasStyles.StyledCard>
          </Col>
        </Row>

        <Row>
          <Col>
            <ContasStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                <Card.Title>Contas Cadastradas</Card.Title>
                <div className="table-responsive">
                  <ContasStyles.StyledTable striped bordered hover isDarkMode={isDarkMode}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Saldo</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contas.map((conta) => (
                        <tr key={conta._id}>
                          <td>
                            {editingId === conta._id ? (
                              <Form.Control
                                type="text"
                                name="nome"
                                value={editedConta.nome}
                                onChange={handleEditChange}
                              />
                            ) : (
                              conta.nome
                            )}
                          </td>
                          <td>
                            {editingId === conta._id ? (
                              <Form.Control
                                type="number"
                                step="0.01"
                                name="saldo"
                                value={editedConta.saldo}
                                onChange={handleEditChange}
                              />
                            ) : (
                              `R$ ${parseFloat(conta.saldo).toFixed(2)}`
                            )}
                          </td>
                          <td>
                            {editingId === conta._id ? (
                              <Form.Control
                                as="select"
                                name="tipo"
                                value={editedConta.tipo}
                                onChange={handleEditChange}
                              >
                                <option value="Corrente">Corrente</option>
                                <option value="Poupança">Poupança</option>
                                <option value="Investimento">Investimento</option>
                                <option value="Carteira">Carteira</option>
                              </Form.Control>
                            ) : (
                              conta.tipo
                            )}
                          </td>
                          <td>
                            {editingId === conta._id ? (
                              <Form.Control
                                type="date"
                                name="data"
                                value={editedConta.data}
                                onChange={handleEditChange}
                              />
                            ) : (
                              formatDate(conta.data)
                            )}
                          </td>
                          <td>
                            {editingId === conta._id ? (
                              <>
                                <ContasStyles.ResponsiveButton
                                  variant="success"
                                  size="sm"
                                  onClick={handleSaveEdit}
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </ContasStyles.ResponsiveButton>{' '}
                                <ContasStyles.ResponsiveButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setEditingId(null)}
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </ContasStyles.ResponsiveButton>
                              </>
                            ) : (
                              <>
                                <ContasStyles.ResponsiveButton
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleShowDetails(conta)}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </ContasStyles.ResponsiveButton>{' '}
                                <ContasStyles.ResponsiveButton
                                  variant="warning"
                                  size="sm"
                                  onClick={() => handleEdit(conta)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </ContasStyles.ResponsiveButton>{' '}
                                <ContasStyles.ResponsiveButton
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(conta._id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </ContasStyles.ResponsiveButton>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </ContasStyles.StyledTable>
                </div>
              </Card.Body>
            </ContasStyles.StyledCard>
          </Col>
        </Row>

        <ContasStyles.StyledModal
          show={showDetailsModal}
          onHide={handleCloseDetailsModal}
          isDarkMode={isDarkMode}
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalhes da Conta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {detailsConta && (
              <div>
                <p><strong>Nome:</strong> {detailsConta.nome}</p>
                <p><strong>Saldo:</strong> R$ {parseFloat(detailsConta.saldo).toFixed(2)}</p>
                <p><strong>Tipo:</strong> {detailsConta.tipo}</p>
                <p><strong>Data de Criação:</strong> {formatDate(detailsConta.data)}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetailsModal}>
              Fechar
            </Button>
          </Modal.Footer>
        </ContasStyles.StyledModal>
      </ContasStyles.StyledContainer>
    </Layout>
  );
};

export default ContasComp; 