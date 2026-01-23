import { create, list, remove, update } from '../../../services/crudService';

const estoqueResource = 'estoque';

export const estoqueServices = {
  getProdutos: () => list(estoqueResource),
  getCategorias: () => list('categorias'),
  createProduto: (payload) => create(estoqueResource, payload),
  updateProduto: (id, payload) => update(estoqueResource, id, payload),
  deleteProduto: (id) => remove(estoqueResource, id),
};
