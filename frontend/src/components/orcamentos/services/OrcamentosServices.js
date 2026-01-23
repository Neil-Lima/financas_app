import { customRequest, list, remove, create, update } from '../../../services/crudService';

const orcamentosResource = 'orcamentos';

export const orcamentosServices = {
  getOrcamentos: (ano) => list(orcamentosResource, { ano }),
  getCategorias: () => list('categorias'),
  createOrcamento: (payload) => create(orcamentosResource, payload),
  updateOrcamento: (id, payload) => update(orcamentosResource, id, payload),
  deleteOrcamento: (id) => remove(orcamentosResource, id),
  compararAnual: (anoAtual, anoAnterior) =>
    customRequest('get', `${orcamentosResource}/comparar-anual`, null, {
      params: { anoAtual, anoAnterior },
    }),
};
