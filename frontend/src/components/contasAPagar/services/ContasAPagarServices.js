import { create, list, remove, update } from '../../../services/crudService';

const resource = 'contas-a-pagar';

export const contasAPagarServices = {
  listContasAPagar: () => list(resource),
  createContaAPagar: (data) => create(resource, data),
  updateContaAPagar: (id, data) => update(resource, id, data),
  deleteContaAPagar: (id) => remove(resource, id),
};
