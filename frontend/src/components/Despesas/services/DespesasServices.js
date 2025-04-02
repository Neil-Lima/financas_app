import { apiService } from '../../../shared/services/api';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Serviços para gerenciamento de despesas
 */
const DespesasServices = {
  /**
   * Busca todas as despesas
   * @returns {Promise} Promise com a lista de despesas
   */
  fetchDespesas: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.DESPESAS.BASE);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      throw error;
    }
  },

  /**
   * Busca todas as categorias
   * @returns {Promise} Promise com a lista de categorias
   */
  fetchCategorias: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.CATEGORIAS.BASE);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  /**
   * Adiciona uma nova despesa
   * @param {Object} despesa - Dados da despesa a ser adicionada
   * @returns {Promise} Promise com os dados da despesa adicionada
   */
  addDespesa: async (despesa) => {
    try {
      return await apiService.post(API_ENDPOINTS.DESPESAS.BASE, despesa);
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma despesa existente
   * @param {string} id - ID da despesa a ser atualizada
   * @param {Object} despesa - Novos dados da despesa
   * @returns {Promise} Promise com os dados da despesa atualizada
   */
  updateDespesa: async (id, despesa) => {
    try {
      return await apiService.put(API_ENDPOINTS.DESPESAS.BY_ID(id), despesa);
    } catch (error) {
      console.error('Erro ao editar despesa:', error);
      throw error;
    }
  },

  /**
   * Remove uma despesa
   * @param {string} id - ID da despesa a ser removida
   * @returns {Promise} Promise com os dados da resposta
   */
  deleteDespesa: async (id) => {
    try {
      return await apiService.delete(API_ENDPOINTS.DESPESAS.BY_ID(id));
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      throw error;
    }
  }
};

export default DespesasServices; 