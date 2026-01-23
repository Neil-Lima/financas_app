import { create, list, remove, update } from '../../../services/crudService';

const financiamentosResource = 'financiamentos';

export const financiamentosServices = {
  getFinanciamentos: () => list(financiamentosResource),
  createFinanciamento: (payload) => create(financiamentosResource, payload),
  updateFinanciamento: (id, payload) => update(financiamentosResource, id, payload),
  deleteFinanciamento: (id) => remove(financiamentosResource, id),
};
