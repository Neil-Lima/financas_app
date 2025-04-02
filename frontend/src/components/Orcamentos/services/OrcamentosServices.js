import { apiService } from '../../../shared/services/api';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Serviços para gerenciamento de orçamentos
 */
const OrcamentosServices = {
  /**
   * Busca todos os orçamentos
   * @returns {Promise} Promise com a lista de orçamentos
   */
  fetchOrcamentos: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.ORCAMENTOS.BASE);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
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
   * Adiciona um novo orçamento
   * @param {Object} orcamento - Dados do orçamento a ser adicionado
   * @returns {Promise} Promise com os dados do orçamento adicionado
   */
  addOrcamento: async (orcamento) => {
    try {
      return await apiService.post(API_ENDPOINTS.ORCAMENTOS.BASE, orcamento);
    } catch (error) {
      console.error('Erro ao adicionar orçamento:', error);
      throw error;
    }
  },

  /**
   * Atualiza um orçamento existente
   * @param {string} id - ID do orçamento a ser atualizado
   * @param {Object} orcamento - Novos dados do orçamento
   * @returns {Promise} Promise com os dados do orçamento atualizado
   */
  updateOrcamento: async (id, orcamento) => {
    try {
      return await apiService.put(API_ENDPOINTS.ORCAMENTOS.BY_ID(id), orcamento);
    } catch (error) {
      console.error('Erro ao editar orçamento:', error);
      throw error;
    }
  },

  /**
   * Remove um orçamento
   * @param {string} id - ID do orçamento a ser removido
   * @returns {Promise} Promise com os dados da resposta
   */
  deleteOrcamento: async (id) => {
    try {
      return await apiService.delete(API_ENDPOINTS.ORCAMENTOS.BY_ID(id));
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      throw error;
    }
  },

  /**
   * Busca histórico anual de orçamentos por categoria
   * @param {string} categoria - ID da categoria
   * @returns {Promise} Promise com os dados do histórico
   */
  fetchHistoricoAnual: async (categoria) => {
    try {
      return await apiService.get(API_ENDPOINTS.ORCAMENTOS.HISTORICO_ANUAL(categoria));
    } catch (error) {
      console.error('Erro ao buscar histórico anual:', error);
      throw error;
    }
  }
};

export default OrcamentosServices; 