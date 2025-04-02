import { apiService } from '../../../shared/services/api';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Serviços para gerenciamento de metas
 */
const MetasServices = {
  /**
   * Busca todas as metas
   * @returns {Promise} Promise com a lista de metas
   */
  fetchMetas: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.METAS.BASE);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      throw error;
    }
  },

  /**
   * Busca estatísticas de metas
   * @returns {Promise} Promise com estatísticas de metas
   */
  fetchEstatisticas: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.METAS.ESTATISTICAS);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  /**
   * Adiciona uma nova meta
   * @param {Object} meta - Dados da meta a ser adicionada
   * @returns {Promise} Promise com os dados da meta adicionada
   */
  addMeta: async (meta) => {
    try {
      return await apiService.post(API_ENDPOINTS.METAS.BASE, meta);
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma meta existente
   * @param {string} id - ID da meta a ser atualizada
   * @param {Object} meta - Novos dados da meta
   * @returns {Promise} Promise com os dados da meta atualizada
   */
  updateMeta: async (id, meta) => {
    try {
      return await apiService.put(API_ENDPOINTS.METAS.BY_ID(id), meta);
    } catch (error) {
      console.error('Erro ao editar meta:', error);
      throw error;
    }
  },

  /**
   * Remove uma meta
   * @param {string} id - ID da meta a ser removida
   * @returns {Promise} Promise com os dados da resposta
   */
  deleteMeta: async (id) => {
    try {
      return await apiService.delete(API_ENDPOINTS.METAS.BY_ID(id));
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      throw error;
    }
  },

  /**
   * Atualiza o progresso de uma meta
   * @param {string} id - ID da meta
   * @param {number} valorAtual - Novo valor atual
   * @returns {Promise} Promise com os dados da meta atualizada
   */
  atualizarProgresso: async (id, valorAtual) => {
    try {
      return await apiService.patch(API_ENDPOINTS.METAS.PROGRESSO(id), { valor_atual: valorAtual });
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      throw error;
    }
  }
};

export default MetasServices; 