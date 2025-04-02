import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faChartLine, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../../../shared/utils/formatters';
import Card from '../../../Generic/Card';

const SummaryCardsComp = ({ resumo }) => {
  return (
    <Row className="mb-4">
      <Col md={4}>
        <Card 
          title="Saldo Total"
          icon={faWallet}
          value={formatCurrency(resumo.saldoTotal)}
          centerContent
        />
      </Col>

      <Col md={4}>
        <Card 
          title="Receitas (Mês)"
          icon={faChartLine}
          value={formatCurrency(resumo.receitasMes)}
          variant="success"
          centerContent
        />
      </Col>

      <Col md={4}>
        <Card 
          title="Despesas (Mês)"
          icon={faExchangeAlt}
          value={formatCurrency(resumo.despesasMes)}
          variant="danger"
          centerContent
        />
      </Col>
    </Row>
  );
};

export default SummaryCardsComp; 