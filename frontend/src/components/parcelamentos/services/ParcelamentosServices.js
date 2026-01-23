import { create, list, remove, update } from '../../../services/crudService';

const parcelamentosResource = 'parcelamentos';

export const parcelamentosServices = {
  getParcelamentos: () => list(parcelamentosResource),
  getCategorias: () => list('categorias'),
  createParcelamento: (payload) => create(parcelamentosResource, payload),
  updateParcelamento: (id, payload) => update(parcelamentosResource, id, payload),
  deleteParcelamento: (id) => remove(parcelamentosResource, id),
};
