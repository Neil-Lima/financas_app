import axios from 'axios';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Serviços para gerenciamento de contas
 */
const ContasServices = {
  /**
   * Busca todas as contas
   * @returns {Promise} Promise com a lista de contas
   */
  fetchContas: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.CONTAS.BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      throw error;
    }
  },

  /**
   * Adiciona uma nova conta
   * @param {Object} conta - Dados da conta a ser adicionada
   * @returns {Promise} Promise com os dados da conta adicionada
   */
  addConta: async (conta) => {
    try {
      const token = localStorage.getItem('token');
      const formattedData = {
        ...conta,
        data: new Date(conta.data).toISOString()
      };
      const response = await axios.post(API_ENDPOINTS.CONTAS.BASE, formattedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma conta existente
   * @param {string} id - ID da conta a ser atualizada
   * @param {Object} conta - Novos dados da conta
   * @returns {Promise} Promise com os dados da conta atualizada
   */
  updateConta: async (id, conta) => {
    try {
      const token = localStorage.getItem('token');
      const formattedData = {
        ...conta,
        data: new Date(conta.data).toISOString()
      };
      const response = await axios.put(API_ENDPOINTS.CONTAS.BY_ID(id), formattedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao editar conta:', error);
      throw error;
    }
  },

  /**
   * Remove uma conta
   * @param {string} id - ID da conta a ser removida
   * @returns {Promise} Promise com os dados da resposta
   */
  deleteConta: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(API_ENDPOINTS.CONTAS.BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      throw error;
    }
  }
};

export default ContasServices; 