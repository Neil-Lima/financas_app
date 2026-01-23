import { create, list, remove, update } from '../../../services/crudService';

const contasResource = 'contas';

export const contasServices = {
  getContas: () => list(contasResource),
  createConta: (payload) => create(contasResource, payload),
  updateConta: (id, payload) => update(contasResource, id, payload),
  deleteConta: (id) => remove(contasResource, id),
};
