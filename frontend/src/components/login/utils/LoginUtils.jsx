import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginServices } from '../services/LoginServices';

export function useLoginUtils() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('info');
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const response = await loginServices.login(email, password);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.usuario));
        if (response?.usuario?.id) {
          localStorage.setItem('userId', String(response.usuario.id));
        }
        navigate('/home');
      } catch (error) {
        setAlertVariant('danger');
        setAlertMessage(error.response?.data?.message || 'Erro ao fazer login');
        setShowAlert(true);
      }
    },
    [email, password, navigate]
  );

  const handleRegister = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await loginServices.register(registerName, registerEmail, registerPassword);

        window.alert('Usuário cadastrado com sucesso! Faça login para continuar.');

        setAlertVariant('success');
        setAlertMessage('Registro bem-sucedido! Faça login para continuar.');
        setShowAlert(true);
        setShowRegisterModal(false);
        setEmail(registerEmail);
        setPassword(registerPassword);
      } catch (error) {
        setAlertVariant('danger');

        let message = '';
        if (error.response && error.response.status === 400 && error.response.data.message.includes('já está em uso')) {
          message = 'Este e-mail já está cadastrado. Por favor, use um e-mail diferente.';
        } else {
          message = error.response?.data?.message || 'Erro ao registrar';
        }

        window.alert(message);
        setAlertMessage(message);
        setShowAlert(true);
      }
    },
    [registerName, registerEmail, registerPassword]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    showRegisterModal,
    setShowRegisterModal,
    registerName,
    setRegisterName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    showAlert,
    setShowAlert,
    alertMessage,
    alertVariant,
    handleLogin,
    handleRegister,
  };
}
