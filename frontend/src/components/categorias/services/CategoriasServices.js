import { create, list, remove, update } from '../../../services/crudService';

const categoriasResource = 'categorias';

export const categoriasServices = {
  getCategorias: () => list(categoriasResource),
  createCategoria: (payload) => create(categoriasResource, payload),
  updateCategoria: (id, payload) => update(categoriasResource, id, payload),
  deleteCategoria: (id) => remove(categoriasResource, id),
};
