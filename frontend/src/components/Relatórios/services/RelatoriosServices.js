import { apiService } from '../../../shared/services/api';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';
import { format } from 'date-fns';

/**
 * Serviço para gerenciamento de relatórios
 */
const RelatoriosServices = {
  /**
   * Busca transações para o relatório com base no período e filtros
   * @param {Object} params - Parâmetros para filtrar as transações
   * @param {Date} params.startDate - Data inicial do período
   * @param {Date} params.endDate - Data final do período
   * @param {string} params.tipo - Tipo de transação (receita, despesa, todas)
   * @param {string} params.categoria - Categoria da transação
   * @returns {Promise} - Promessa com os dados das transações
   */
  async fetchTransacoes(params) {
    try {
      const { startDate, endDate, tipo, categoria } = params;
      
      const queryParams = {
        dataInicio: format(new Date(startDate), 'yyyy-MM-dd'),
        dataFim: format(new Date(endDate), 'yyyy-MM-dd')
      };
      
      if (tipo && tipo !== 'todas') {
        queryParams.tipo = tipo;
      }
      
      if (categoria) {
        queryParams.categoria = categoria;
      }
      
      const response = await apiService.get(API_ENDPOINTS.TRANSACOES.LIST, { params: queryParams });
      return response;
    } catch (error) {
      console.error('Erro ao buscar transações para relatório:', error);
      throw error;
    }
  },
  
  /**
   * Gera relatório com resumo financeiro do período
   * @param {Object} params - Parâmetros para o relatório
   * @param {Date} params.startDate - Data inicial do período
   * @param {Date} params.endDate - Data final do período
   * @returns {Promise} - Promessa com os dados do relatório
   */
  async gerarRelatorioResumo(params) {
    try {
      const { startDate, endDate } = params;
      
      const queryParams = {
        dataInicio: format(new Date(startDate), 'yyyy-MM-dd'),
        dataFim: format(new Date(endDate), 'yyyy-MM-dd')
      };
      
      const response = await apiService.get(API_ENDPOINTS.RELATORIOS.RESUMO, { params: queryParams });
      return response;
    } catch (error) {
      console.error('Erro ao gerar relatório de resumo:', error);
      throw error;
    }
  },
  
  /**
   * Gera relatório de despesas por categoria
   * @param {Object} params - Parâmetros para o relatório
   * @param {Date} params.startDate - Data inicial do período
   * @param {Date} params.endDate - Data final do período
   * @returns {Promise} - Promessa com os dados do relatório
   */
  async gerarRelatorioDespesasPorCategoria(params) {
    try {
      const { startDate, endDate } = params;
      
      const queryParams = {
        dataInicio: format(new Date(startDate), 'yyyy-MM-dd'),
        dataFim: format(new Date(endDate), 'yyyy-MM-dd')
      };
      
      const response = await apiService.get(API_ENDPOINTS.RELATORIOS.DESPESAS_CATEGORIA, { params: queryParams });
      return response;
    } catch (error) {
      console.error('Erro ao gerar relatório de despesas por categoria:', error);
      throw error;
    }
  },
  
  /**
   * Gera relatório de evolução patrimonial
   * @param {Object} params - Parâmetros para o relatório
   * @param {Date} params.startDate - Data inicial do período
   * @param {Date} params.endDate - Data final do período
   * @returns {Promise} - Promessa com os dados do relatório
   */
  async gerarRelatorioEvolucaoPatrimonial(params) {
    try {
      const { startDate, endDate } = params;
      
      const queryParams = {
        dataInicio: format(new Date(startDate), 'yyyy-MM-dd'),
        dataFim: format(new Date(endDate), 'yyyy-MM-dd')
      };
      
      const response = await apiService.get(API_ENDPOINTS.RELATORIOS.EVOLUCAO_PATRIMONIAL, { params: queryParams });
      return response;
    } catch (error) {
      console.error('Erro ao gerar relatório de evolução patrimonial:', error);
      throw error;
    }
  },
  
  /**
   * Exporta relatório para PDF
   * @param {Object} dados - Dados do relatório
   * @param {string} tipoRelatorio - Tipo do relatório
   * @returns {Promise} - Promessa com a URL do PDF
   */
  async exportarPDF(dados, tipoRelatorio) {
    try {
      const response = await apiService.post(API_ENDPOINTS.RELATORIOS.EXPORTAR_PDF, {
        dados,
        tipoRelatorio
      });
      return response;
    } catch (error) {
      console.error('Erro ao exportar relatório para PDF:', error);
      throw error;
    }
  },
  
  /**
   * Exporta relatório para Excel
   * @param {Object} dados - Dados do relatório
   * @param {string} tipoRelatorio - Tipo do relatório
   * @returns {Promise} - Promessa com a URL do Excel
   */
  async exportarExcel(dados, tipoRelatorio) {
    try {
      const response = await apiService.post(API_ENDPOINTS.RELATORIOS.EXPORTAR_EXCEL, {
        dados,
        tipoRelatorio
      });
      return response;
    } catch (error) {
      console.error('Erro ao exportar relatório para Excel:', error);
      throw error;
    }
  },
  
  /**
   * Busca categorias para filtro de relatórios
   * @returns {Promise} - Promessa com as categorias
   */
  async fetchCategorias() {
    try {
      const response = await apiService.get(API_ENDPOINTS.CATEGORIAS.LIST);
      return response;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  /**
   * Busca transações por período
   * @param {string} startDate Data inicial (formato YYYY-MM-DD)
   * @param {string} endDate Data final (formato YYYY-MM-DD)
   * @returns {Promise} Promise com as transações do período
   */
  fetchTransacoesPorPeriodo: async (startDate, endDate) => {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.TRANSACOES.POR_PERIODO}?dataInicio=${startDate}&dataFim=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar transações por período:', error);
      throw error;
    }
  },

  /**
   * Gera relatório completo com todas as informações financeiras
   * @param {string} startDate Data inicial (formato YYYY-MM-DD)
   * @param {string} endDate Data final (formato YYYY-MM-DD)
   * @returns {Promise} Promise com o relatório completo
   */
  gerarRelatorioCompleto: async (startDate, endDate) => {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.RELATORIOS.COMPLETO}?dataInicio=${startDate}&dataFim=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório completo:', error);
      throw error;
    }
  },

  /**
   * Gera relatório de transações
   * @param {string} startDate Data inicial (formato YYYY-MM-DD)
   * @param {string} endDate Data final (formato YYYY-MM-DD)
   * @param {string} tipo Tipo de transação (receita, despesa ou todos)
   * @returns {Promise} Promise com o relatório de transações
   */
  gerarRelatorioTransacoes: async (startDate, endDate, tipo = 'todos') => {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.RELATORIOS.TRANSACOES}?dataInicio=${startDate}&dataFim=${endDate}&tipo=${tipo}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de transações:', error);
      throw error;
    }
  },

  /**
   * Gera relatório de orçamentos
   * @param {string} mes Mês no formato (YYYY-MM)
   * @returns {Promise} Promise com o relatório de orçamentos
   */
  gerarRelatorioOrcamentos: async (mes) => {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.RELATORIOS.ORCAMENTOS}?mes=${mes}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de orçamentos:', error);
      throw error;
    }
  },

  /**
   * Gera relatório de metas
   * @returns {Promise} Promise com o relatório de metas
   */
  gerarRelatorioMetas: async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.RELATORIOS.METAS);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de metas:', error);
      throw error;
    }
  },

  /**
   * Gera relatório de fluxo de caixa
   * @param {number} meses Número de meses para incluir no relatório
   * @returns {Promise} Promise com o relatório de fluxo de caixa
   */
  gerarRelatorioFluxoCaixa: async (meses = 12) => {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.RELATORIOS.FLUXO_CAIXA}?meses=${meses}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de fluxo de caixa:', error);
      throw error;
    }
  },

  /**
   * Baixa relatório em formato PDF
   * @param {string} startDate Data inicial (formato YYYY-MM-DD)
   * @param {string} endDate Data final (formato YYYY-MM-DD)
   * @returns {Promise} Promise com o blob do PDF
   */
  downloadRelatorioPDF: async (startDate, endDate) => {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.RELATORIOS.PDF}?dataInicio=${startDate}&dataFim=${endDate}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar relatório em PDF:', error);
      throw error;
    }
  },

  /**
   * Baixa relatório em formato Excel
   * @param {string} startDate Data inicial (formato YYYY-MM-DD)
   * @param {string} endDate Data final (formato YYYY-MM-DD)
   * @returns {Promise} Promise com o blob do Excel
   */
  downloadRelatorioExcel: async (startDate, endDate) => {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.RELATORIOS.EXCEL}?dataInicio=${startDate}&dataFim=${endDate}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao baixar relatório em Excel:', error);
      throw error;
    }
  }
};

export default RelatoriosServices; 