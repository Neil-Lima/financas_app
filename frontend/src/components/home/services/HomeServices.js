import { customRequest, list } from '../../../services/crudService';

export const homeServices = {
  getContas: () => list('contas'),
  getDespesas: () => list('despesas'),
  getEstoque: () => list('estoque'),
  getFinanciamentos: () => list('financiamentos'),
  getMetas: () => list('metas'),
  getOrcamentos: () => list('orcamentos'),
  getParcelamentos: () => list('parcelamentos'),
  getTransacoes: () => list('transacoes'),
  getCategorias: () => list('categorias'),
};
