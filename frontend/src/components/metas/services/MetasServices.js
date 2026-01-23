import { customRequest, list, remove, create, update } from '../../../services/crudService';

const metasResource = 'metas';

export const metasServices = {
  getMetas: () => list(metasResource),
  getEstatisticas: () => customRequest('get', `${metasResource}/estatisticas`),
  createMeta: (payload) => create(metasResource, payload),
  updateMeta: (id, payload) => update(metasResource, id, payload),
  deleteMeta: (id) => remove(metasResource, id),
};
