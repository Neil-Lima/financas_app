import { apiService } from '../../../shared/services/api';
import { API_ENDPOINTS } from '../../../shared/constants/apiEndpoints';

/**
 * Serviços para gerenciamento de usuários
 */
const UsuariosServices = {
  /**
   * Busca o perfil do usuário logado
   * @returns {Promise} Promise com os dados do usuário
   */
  fetchPerfil: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.USUARIOS.PERFIL);
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      throw error;
    }
  },

  /**
   * Atualiza os dados do perfil do usuário
   * @param {Object} dadosPerfil - Novos dados do perfil
   * @returns {Promise} Promise com os dados atualizados
   */
  atualizarPerfil: async (dadosPerfil) => {
    try {
      return await apiService.put(API_ENDPOINTS.USUARIOS.PERFIL, dadosPerfil);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  /**
   * Altera a senha do usuário
   * @param {Object} senhas - Objeto com a senha atual e a nova senha
   * @returns {Promise} Promise com a resposta da requisição
   */
  alterarSenha: async (senhas) => {
    try {
      return await apiService.put(API_ENDPOINTS.USUARIOS.ALTERAR_SENHA, senhas);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  },

  /**
   * Busca as preferências do usuário
   * @returns {Promise} Promise com as preferências do usuário
   */
  fetchPreferencias: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.USUARIOS.PREFERENCIAS);
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
      throw error;
    }
  },

  /**
   * Atualiza as preferências do usuário
   * @param {Object} preferencias - Novas preferências
   * @returns {Promise} Promise com as preferências atualizadas
   */
  atualizarPreferencias: async (preferencias) => {
    try {
      return await apiService.put(API_ENDPOINTS.USUARIOS.PREFERENCIAS, preferencias);
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      throw error;
    }
  },

  /**
   * Faz upload da foto de perfil do usuário
   * @param {FormData} formData - FormData contendo a imagem
   * @returns {Promise} Promise com a URL da nova foto
   */
  uploadFoto: async (formData) => {
    try {
      return await apiService.post(API_ENDPOINTS.USUARIOS.UPLOAD_FOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      throw error;
    }
  },

  /**
   * Busca as sessões ativas do usuário
   * @returns {Promise} Promise com as sessões ativas
   */
  fetchSessoes: async () => {
    try {
      return await apiService.get(API_ENDPOINTS.USUARIOS.SESSOES);
    } catch (error) {
      console.error('Erro ao buscar sessões:', error);
      throw error;
    }
  },

  /**
   * Fecha uma sessão específica
   * @param {string} sessionId - ID da sessão
   * @returns {Promise} Promise com a resposta da requisição
   */
  encerrarSessao: async (sessionId) => {
    try {
      return await apiService.delete(API_ENDPOINTS.USUARIOS.SESSAO(sessionId));
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      throw error;
    }
  },

  /**
   * Fecha todas as sessões exceto a atual
   * @returns {Promise} Promise com a resposta da requisição
   */
  encerrarOutrasSessoes: async () => {
    try {
      return await apiService.delete(API_ENDPOINTS.USUARIOS.OUTRAS_SESSOES);
    } catch (error) {
      console.error('Erro ao encerrar outras sessões:', error);
      throw error;
    }
  }
};

export default UsuariosServices; 