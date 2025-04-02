import { apiService } from '../../../shared/services/api';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Serviços para gerenciamento de financiamentos
 */
const FinanciamentosServices = {
  /**
   * Busca todos os financiamentos
   * @returns {Promise} Promise com a lista de financiamentos
   */
  fetchFinanciamentos: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.FINANCIAMENTOS.BASE);
    } catch (error) {
      console.error('Erro ao buscar financiamentos:', error);
      throw error;
    }
  },

  /**
   * Adiciona um novo financiamento
   * @param {Object} financiamento - Dados do financiamento a ser adicionado
   * @returns {Promise} Promise com os dados do financiamento adicionado
   */
  addFinanciamento: async (financiamento) => {
    try {
      return await apiService.post(API_ENDPOINTS.FINANCIAMENTOS.BASE, financiamento);
    } catch (error) {
      console.error('Erro ao adicionar financiamento:', error);
      throw error;
    }
  },

  /**
   * Atualiza um financiamento existente
   * @param {string} id - ID do financiamento a ser atualizado
   * @param {Object} financiamento - Novos dados do financiamento
   * @returns {Promise} Promise com os dados do financiamento atualizado
   */
  updateFinanciamento: async (id, financiamento) => {
    try {
      return await apiService.put(API_ENDPOINTS.FINANCIAMENTOS.BY_ID(id), financiamento);
    } catch (error) {
      console.error('Erro ao editar financiamento:', error);
      throw error;
    }
  },

  /**
   * Remove um financiamento
   * @param {string} id - ID do financiamento a ser removido
   * @returns {Promise} Promise com os dados da resposta
   */
  deleteFinanciamento: async (id) => {
    try {
      return await apiService.delete(API_ENDPOINTS.FINANCIAMENTOS.BY_ID(id));
    } catch (error) {
      console.error('Erro ao deletar financiamento:', error);
      throw error;
    }
  },
  
  /**
   * Calcula as parcelas de um financiamento
   * @param {number} valorTotal - Valor total do financiamento
   * @param {number} taxaJuros - Taxa de juros mensal (em porcentagem)
   * @param {number} parcelas - Número de parcelas
   * @returns {Array} Array com as parcelas calculadas
   */
  calcularParcelas: (valorTotal, taxaJuros, parcelas) => {
    const taxaDecimal = taxaJuros / 100;
    const valorParcela = (valorTotal * taxaDecimal * Math.pow(1 + taxaDecimal, parcelas)) / 
                          (Math.pow(1 + taxaDecimal, parcelas) - 1);
    
    const parcelasCalculadas = [];
    let saldoDevedor = valorTotal;
    
    for (let i = 1; i <= parcelas; i++) {
      const juros = saldoDevedor * taxaDecimal;
      const amortizacao = valorParcela - juros;
      saldoDevedor -= amortizacao;
      
      parcelasCalculadas.push({
        numero: i,
        valorParcela: valorParcela,
        juros: juros,
        amortizacao: amortizacao,
        saldoDevedor: saldoDevedor > 0 ? saldoDevedor : 0
      });
    }
    
    return parcelasCalculadas;
  }
};

export default FinanciamentosServices;