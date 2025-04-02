import axios from 'axios';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Instância do axios configurada com a URL base
const api = axios.create({
  baseURL: 'https://financas-app-kappa.vercel.app/api',
  timeout: 10000
});

// Interceptador para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador para tratamento de erros nas respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redireciona para a página de login em caso de token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Métodos genéricos para comunicação com a API
 */
export const apiService = {
  /**
   * Realiza uma requisição GET
   * @param {string} url - URL da requisição
   * @param {Object} params - Parâmetros da requisição
   * @returns {Promise} Promessa com a resposta da requisição
   */
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao fazer requisição GET para ${url}:`, error);
      throw error;
    }
  },

  /**
   * Realiza uma requisição POST
   * @param {string} url - URL da requisição
   * @param {Object} data - Dados a serem enviados no corpo da requisição
   * @returns {Promise} Promessa com a resposta da requisição
   */
  post: async (url, data = {}) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao fazer requisição POST para ${url}:`, error);
      throw error;
    }
  },

  /**
   * Realiza uma requisição PUT
   * @param {string} url - URL da requisição
   * @param {Object} data - Dados a serem enviados no corpo da requisição
   * @returns {Promise} Promessa com a resposta da requisição
   */
  put: async (url, data = {}) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao fazer requisição PUT para ${url}:`, error);
      throw error;
    }
  },

  /**
   * Realiza uma requisição DELETE
   * @param {string} url - URL da requisição
   * @returns {Promise} Promessa com a resposta da requisição
   */
  delete: async (url) => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      console.error(`Erro ao fazer requisição DELETE para ${url}:`, error);
      throw error;
    }
  }
};

export default api; 