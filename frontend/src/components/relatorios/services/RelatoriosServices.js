import { customRequest } from '../../../services/crudService';

export const relatoriosServices = {
  getRelatorioCompleto: (dataInicio, dataFim) =>
    customRequest('GET', `relatorios/completo?dataInicio=${dataInicio}&dataFim=${dataFim}`),

  downloadPDF: (dataInicio, dataFim) =>
    customRequest('GET', `relatorios/pdf?dataInicio=${dataInicio}&dataFim=${dataFim}`, null, { responseType: 'blob' }),
};
