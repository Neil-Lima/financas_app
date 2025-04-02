import { apiService } from '../../../shared/services/api';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Serviços para gerenciamento de estoque
 */
const EstoqueServices = {
  /**
   * Busca todos os itens do estoque
   * @returns {Promise} Promise com a lista de itens
   */
  fetchEstoque: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.ESTOQUE.BASE);
    } catch (error) {
      console.error('Erro ao buscar itens do estoque:', error);
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
   * Adiciona um novo item ao estoque
   * @param {Object} item - Dados do item a ser adicionado
   * @returns {Promise} Promise com os dados do item adicionado
   */
  addItem: async (item) => {
    try {
      return await apiService.post(API_ENDPOINTS.ESTOQUE.BASE, item);
    } catch (error) {
      console.error('Erro ao adicionar item ao estoque:', error);
      throw error;
    }
  },

  /**
   * Atualiza um item existente no estoque
   * @param {string} id - ID do item a ser atualizado
   * @param {Object} item - Novos dados do item
   * @returns {Promise} Promise com os dados do item atualizado
   */
  updateItem: async (id, item) => {
    try {
      return await apiService.put(API_ENDPOINTS.ESTOQUE.BY_ID(id), item);
    } catch (error) {
      console.error('Erro ao editar item do estoque:', error);
      throw error;
    }
  },

  /**
   * Remove um item do estoque
   * @param {string} id - ID do item a ser removido
   * @returns {Promise} Promise com os dados da resposta
   */
  deleteItem: async (id) => {
    try {
      return await apiService.delete(API_ENDPOINTS.ESTOQUE.BY_ID(id));
    } catch (error) {
      console.error('Erro ao deletar item do estoque:', error);
      throw error;
    }
  }
};

export default EstoqueServices; 