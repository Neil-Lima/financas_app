import { apiService } from '../../../shared/services/api';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Serviços para gerenciamento de transações
 */
const TransacoesServices = {
  /**
   * Busca todas as transações
   * @returns {Promise} Promise com a lista de transações
   */
  fetchTransacoes: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.TRANSACOES.BASE);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  },

  /**
   * Busca todas as contas
   * @returns {Promise} Promise com a lista de contas
   */
  fetchContas: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.CONTAS.BASE);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
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
   * Adiciona uma nova transação
   * @param {Object} transacao - Dados da transação a ser adicionada
   * @returns {Promise} Promise com os dados da transação adicionada
   */
  addTransacao: async (transacao) => {
    try {
      return await apiService.post(API_ENDPOINTS.TRANSACOES.BASE, transacao);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma transação existente
   * @param {string} id - ID da transação a ser atualizada
   * @param {Object} transacao - Novos dados da transação
   * @returns {Promise} Promise com os dados da transação atualizada
   */
  updateTransacao: async (id, transacao) => {
    try {
      return await apiService.put(API_ENDPOINTS.TRANSACOES.BY_ID(id), transacao);
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      throw error;
    }
  },

  /**
   * Remove uma transação
   * @param {string} id - ID da transação a ser removida
   * @returns {Promise} Promise com os dados da resposta
   */
  deleteTransacao: async (id) => {
    try {
      return await apiService.delete(API_ENDPOINTS.TRANSACOES.BY_ID(id));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  },

  /**
   * Gera um relatório de transações para um período específico
   * @param {string} startDate - Data inicial do período
   * @param {string} endDate - Data final do período
   * @returns {Promise} Promise com os dados do relatório
   */
  generateReport: async (startDate, endDate) => {
    try {
      const params = { startDate, endDate };
      return await apiService.get(API_ENDPOINTS.TRANSACOES.RELATORIO, params);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  }
};

export default TransacoesServices; 