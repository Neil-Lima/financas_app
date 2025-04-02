import { apiService } from '../../../shared/services/api';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Serviços para gerenciamento de parcelamentos
 */
const ParcelamentosServices = {
  /**
   * Busca todos os parcelamentos
   * @returns {Promise} Promise com a lista de parcelamentos
   */
  fetchParcelamentos: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.PARCELAMENTOS.BASE);
    } catch (error) {
      console.error('Erro ao buscar parcelamentos:', error);
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
   * Adiciona um novo parcelamento
   * @param {Object} parcelamento - Dados do parcelamento a ser adicionado
   * @returns {Promise} Promise com os dados do parcelamento adicionado
   */
  addParcelamento: async (parcelamento) => {
    try {
      return await apiService.post(API_ENDPOINTS.PARCELAMENTOS.BASE, parcelamento);
    } catch (error) {
      console.error('Erro ao adicionar parcelamento:', error);
      throw error;
    }
  },

  /**
   * Atualiza um parcelamento existente
   * @param {string} id - ID do parcelamento a ser atualizado
   * @param {Object} parcelamento - Novos dados do parcelamento
   * @returns {Promise} Promise com os dados do parcelamento atualizado
   */
  updateParcelamento: async (id, parcelamento) => {
    try {
      return await apiService.put(API_ENDPOINTS.PARCELAMENTOS.BY_ID(id), parcelamento);
    } catch (error) {
      console.error('Erro ao editar parcelamento:', error);
      throw error;
    }
  },

  /**
   * Remove um parcelamento
   * @param {string} id - ID do parcelamento a ser removido
   * @returns {Promise} Promise com os dados da resposta
   */
  deleteParcelamento: async (id) => {
    try {
      return await apiService.delete(API_ENDPOINTS.PARCELAMENTOS.BY_ID(id));
    } catch (error) {
      console.error('Erro ao deletar parcelamento:', error);
      throw error;
    }
  },

  /**
   * Calcula parcelas de um parcelamento
   * @param {Object} parcelamentoData - Dados para cálculo de parcelas
   * @returns {Array} Array com os dados das parcelas calculadas
   */
  calcularParcelas: async (parcelamentoData) => {
    try {
      return await apiService.post(API_ENDPOINTS.PARCELAMENTOS.CALCULAR, parcelamentoData);
    } catch (error) {
      console.error('Erro ao calcular parcelas:', error);
      throw error;
    }
  }
};

export default ParcelamentosServices; 