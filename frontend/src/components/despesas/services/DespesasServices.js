import { create, list, remove, update } from '../../../services/crudService';

const despesasResource = 'despesas';

export const despesasServices = {
  getDespesas: () => list(despesasResource),
  getCategorias: () => list('categorias'),
  createDespesa: (payload) => create(despesasResource, payload),
  updateDespesa: (id, payload) => update(despesasResource, id, payload),
  deleteDespesa: (id) => remove(despesasResource, id),
};
