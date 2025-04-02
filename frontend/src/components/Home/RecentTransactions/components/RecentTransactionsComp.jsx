import React from 'react';
import { Button } from 'react-bootstrap';
import { formatCurrency } from '../../../../shared/utils/formatters';
import Card from '../../../Generic/Card';
import Table from '../../../Generic/Table';

const RecentTransactionsComp = ({ transacoes }) => {
  // Colunas para a tabela de transações recentes
  const transactionColumns = [
    {
      header: "Data",
      accessor: "data",
      cell: (row) => new Date(row.data).toLocaleDateString()
    },
    {
      header: "Descrição",
      accessor: "descricao"
    },
    {
      header: "Valor",
      accessor: "valor",
      cell: (row) => formatCurrency(row.valor)
    },
    {
      header: "Tipo",
      accessor: "tipo",
      cell: (row) => (
        <span className={row.tipo === 'receita' ? 'text-success' : 'text-danger'}>
          {row.tipo === 'receita' ? 'Receita' : 'Despesa'}
        </span>
      )
    }
  ];

  return (
    <Card title="Transações Recentes">
      <Table 
        columns={transactionColumns}
        data={transacoes}
      />
      <Button variant="primary" href="/transacoes" className="mt-3">Ver Todas</Button>
    </Card>
  );
};

export default RecentTransactionsComp; 