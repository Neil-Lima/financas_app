import { list } from '../../../services/crudService';

const resource = 'vencimentos';

export const vencimentosServices = {
  listVencimentos: (params = {}) => list(resource, params),
};
