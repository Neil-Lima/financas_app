import { useState, useEffect, useCallback } from 'react';
import UsuariosServices from '../services/UsuariosServices';

/**
 * Hook para gerenciamento de perfil de usuário
 */
export const useUsuario = () => {
  const [perfil, setPerfil] = useState(null);
  const [preferencias, setPreferencias] = useState(null);
  const [sessoes, setSessoes] = useState([]);
  const [perfilForm, setPerfilForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    profissao: ''
  });
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /**
   * Busca o perfil do usuário
   */
  const fetchPerfil = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await UsuariosServices.fetchPerfil();
      setPerfil(response.data);
      setPerfilForm({
        nome: response.data.nome || '',
        email: response.data.email || '',
        telefone: response.data.telefone || '',
        profissao: response.data.profissao || ''
      });
    } catch (err) {
      setError('Erro ao carregar perfil. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao carregar perfil', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Busca as preferências do usuário
   */
  const fetchPreferencias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await UsuariosServices.fetchPreferencias();
      setPreferencias(response.data);
    } catch (err) {
      setError('Erro ao carregar preferências. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao carregar preferências', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Busca as sessões ativas do usuário
   */
  const fetchSessoes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await UsuariosServices.fetchSessoes();
      setSessoes(response.data);
    } catch (err) {
      setError('Erro ao carregar sessões. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao carregar sessões', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualiza o perfil do usuário
   */
  const atualizarPerfil = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await UsuariosServices.atualizarPerfil(perfilForm);
      setPerfil(response.data);
      showAlert('Perfil atualizado com sucesso', 'success');
    } catch (err) {
      setError('Erro ao atualizar perfil. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao atualizar perfil', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [perfilForm]);

  /**
   * Altera a senha do usuário
   */
  const alterarSenha = useCallback(async () => {
    if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
      showAlert('As senhas não coincidem', 'danger');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await UsuariosServices.alterarSenha({
        senhaAtual: senhaForm.senhaAtual,
        novaSenha: senhaForm.novaSenha
      });
      setSenhaForm({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
      setShowPasswordModal(false);
      showAlert('Senha alterada com sucesso', 'success');
    } catch (err) {
      setError('Erro ao alterar senha. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao alterar senha. Verifique se a senha atual está correta.', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [senhaForm]);

  /**
   * Atualiza as preferências do usuário
   */
  const atualizarPreferencias = useCallback(async (novasPreferencias) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await UsuariosServices.atualizarPreferencias(novasPreferencias);
      setPreferencias(response.data);
      showAlert('Preferências atualizadas com sucesso', 'success');
    } catch (err) {
      setError('Erro ao atualizar preferências. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao atualizar preferências', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Encerra uma sessão específica
   */
  const encerrarSessao = useCallback(async (sessionId) => {
    setIsLoading(true);
    setError(null);
    try {
      await UsuariosServices.encerrarSessao(sessionId);
      await fetchSessoes();
      showAlert('Sessão encerrada com sucesso', 'success');
    } catch (err) {
      setError('Erro ao encerrar sessão. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao encerrar sessão', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessoes]);

  /**
   * Encerra todas as sessões exceto a atual
   */
  const encerrarOutrasSessoes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await UsuariosServices.encerrarOutrasSessoes();
      await fetchSessoes();
      showAlert('Todas as outras sessões foram encerradas', 'success');
    } catch (err) {
      setError('Erro ao encerrar sessões. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao encerrar sessões', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessoes]);

  /**
   * Faz upload da foto de perfil
   */
  const uploadFoto = useCallback(async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    setIsLoading(true);
    setError(null);
    try {
      const response = await UsuariosServices.uploadFoto(formData);
      setPerfil(prev => ({
        ...prev,
        foto_url: response.data.foto_url
      }));
      showAlert('Foto de perfil atualizada com sucesso', 'success');
    } catch (err) {
      setError('Erro ao fazer upload da foto. Por favor, tente novamente.');
      console.error(err);
      showAlert('Erro ao fazer upload da foto', 'danger');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mostra uma mensagem de alerta
   */
  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: '', variant: 'success' });
    }, 3000);
  }, []);

  /**
   * Manipula mudanças nos campos do formulário de perfil
   */
  const handlePerfilChange = useCallback((e) => {
    const { name, value } = e.target;
    setPerfilForm(prev => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Manipula mudanças nos campos do formulário de senha
   */
  const handleSenhaChange = useCallback((e) => {
    const { name, value } = e.target;
    setSenhaForm(prev => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Manipula a mudança de tema (claro/escuro)
   */
  const handleToggleTema = useCallback(() => {
    if (!preferencias) return;
    
    const novoTema = preferencias.tema === 'claro' ? 'escuro' : 'claro';
    atualizarPreferencias({
      ...preferencias,
      tema: novoTema
    });
  }, [preferencias, atualizarPreferencias]);

  /**
   * Manipula a mudança de receber notificações
   */
  const handleToggleNotificacoes = useCallback((tipo) => {
    if (!preferencias) return;
    
    atualizarPreferencias({
      ...preferencias,
      notificacoes: {
        ...preferencias.notificacoes,
        [tipo]: !preferencias.notificacoes[tipo]
      }
    });
  }, [preferencias, atualizarPreferencias]);

  // Carrega dados iniciais
  useEffect(() => {
    fetchPerfil();
    fetchPreferencias();
    fetchSessoes();
  }, [fetchPerfil, fetchPreferencias, fetchSessoes]);

  return {
    perfil,
    preferencias,
    sessoes,
    perfilForm,
    senhaForm,
    isLoading,
    error,
    alert,
    showPasswordModal,
    showDeleteModal,
    fetchPerfil,
    fetchPreferencias,
    fetchSessoes,
    atualizarPerfil,
    alterarSenha,
    atualizarPreferencias,
    encerrarSessao,
    encerrarOutrasSessoes,
    uploadFoto,
    handlePerfilChange,
    handleSenhaChange,
    handleToggleTema,
    handleToggleNotificacoes,
    setShowPasswordModal,
    setShowDeleteModal,
    showAlert
  };
};

export const UsuariosUtils = {
  useUsuario
}; 