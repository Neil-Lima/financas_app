import { customRequest } from '../../../services/crudService';

export const dividasServices = {
  getResumo: () => customRequest('GET', 'dividas/resumo'),
};
