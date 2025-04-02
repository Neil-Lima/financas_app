import React from 'react';
import { Container } from 'react-bootstrap';
import TransacoesComp from '../components/Transacoes/components/TransacoesComp';

function TransacoesPage() {
  return (
    <Container fluid className="p-0">
      <TransacoesComp />
    </Container>
  );
}

export default TransacoesPage;
