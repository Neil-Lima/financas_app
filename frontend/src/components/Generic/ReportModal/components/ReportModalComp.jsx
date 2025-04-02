import React from 'react';
import { Modal, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { formatDate, formatCurrency } from '../../../../shared/utils/formatters';
import { ReportModalStyles } from '../styles/ReportModalStyles';
import { useTheme } from '../../../../shared/contexts/ThemeContext';

const ReportModalComp = ({ 
  show, 
  onHide, 
  reportData, 
  isLoading, 
  startDate, 
  endDate 
}) => {
  const { isDarkMode } = useTheme();

  return (
    <ReportModalStyles.StyledModal 
      show={show} 
      onHide={onHide} 
      size="lg"
      $isDarkMode={isDarkMode}
    >
      <Modal.Header closeButton>
        <Modal.Title>Relatório Financeiro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Gerando relatório...</p>
          </div>
        ) : reportData ? (
          <>
            <h5>Resumo do Período: {formatDate(startDate)} a {formatDate(endDate)}</h5>
            <Row className="mb-4">
              <Col md={4}>
                <Card>
                  <Card.Body className="text-center">
                    <Card.Title>Receitas</Card.Title>
                    <h3 className="text-success">{formatCurrency(reportData.totalReceitas)}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body className="text-center">
                    <Card.Title>Despesas</Card.Title>
                    <h3 className="text-danger">{formatCurrency(reportData.totalDespesas)}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Body className="text-center">
                    <Card.Title>Balanço</Card.Title>
                    <h3 className={reportData.balanco >= 0 ? 'text-success' : 'text-danger'}>
                      {formatCurrency(reportData.balanco)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <p>Erro ao gerar relatório.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
        <Button variant="primary" href="/relatorios">
          Relatórios Detalhados
        </Button>
      </Modal.Footer>
    </ReportModalStyles.StyledModal>
  );
};

export default ReportModalComp; 