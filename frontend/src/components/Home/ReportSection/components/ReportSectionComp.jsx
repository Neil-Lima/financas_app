import React from 'react';
import { Button } from 'react-bootstrap';
import Card from '../../../Generic/Card';
import DateRangePicker from '../../../Generic/DateRangePicker';

const ReportSectionComp = ({ 
  startDate, 
  endDate, 
  onDateRangeChange, 
  onGenerateReport 
}) => {
  return (
    <Card title="Relatórios">
      <p>Gere relatórios financeiros personalizados</p>
      
      <DateRangePicker 
        startDate={startDate} 
        endDate={endDate}
        onChange={onDateRangeChange}
      />
      
      <div>
        <Button variant="primary" onClick={onGenerateReport} className="me-2">
          Gerar Relatório
        </Button>
        <Button variant="outline-primary" href="/relatorios">
          Relatórios Avançados
        </Button>
      </div>
    </Card>
  );
};

export default ReportSectionComp; 