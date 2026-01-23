import { create, list, remove, update } from '../../../services/crudService';

const transacoesResource = 'transacoes';

export const transacoesServices = {
  getTransacoes: () => list(transacoesResource),
  getContas: () => list('contas'),
  getCategorias: () => list('categorias'),
  createTransacao: (payload) => create(transacoesResource, payload),
  updateTransacao: (id, payload) => update(transacoesResource, id, payload),
  deleteTransacao: (id) => remove(transacoesResource, id),
};
