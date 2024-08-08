import React, { useState } from 'react';
import { Container, Form, Button, Modal, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
`;

const StyledCard = styled(Card)`
  width: 400px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

const StyledForm = styled(Form)`
  padding: 20px;
`;

const StyledInput = styled(Form.Control)`
  border-radius: 20px;
  padding-left: 40px;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
`;

const StyledButton = styled(Button)`
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border: none;
  
  &:hover {
    background: linear-gradient(135deg, #a777e3, #6e8efb);
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 15px;
  }
`;

function LoginPage() {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://financas-app-kappa.vercel.app/api/usuarios/login', { email, senha: password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      navigate('/home');
    } catch (error) {
      setAlertVariant('danger');
      setAlertMessage(error.response?.data?.message || 'Erro ao fazer login');
      setShowAlert(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://financas-app-kappa.vercel.app/api/usuarios/register', {
        nome: registerName,
        email: registerEmail,
        senha: registerPassword
      });
      setAlertVariant('success');
      setAlertMessage('Registro bem-sucedido! Faça login para continuar.');
      setShowAlert(true);
      setShowRegisterModal(false);
      setEmail(registerEmail);
      setPassword(registerPassword);
    } catch (error) {
      setAlertVariant('danger');
      if (error.response && error.response.status === 400 && error.response.data.message.includes('já está em uso')) {
        setAlertMessage('Este e-mail já está cadastrado. Por favor, use um e-mail diferente.');
      } else {
        setAlertMessage(error.response?.data?.message || 'Erro ao registrar');
      }
      setShowAlert(true);
    }
  };

  return (
    <StyledContainer>
      <StyledCard>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {showAlert && (
            <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
              {alertMessage}
            </Alert>
          )}
          <StyledForm onSubmit={handleLogin}>
            <Form.Group className="mb-3 position-relative">
              <IconWrapper>
                <FontAwesomeIcon icon={faEnvelope} />
              </IconWrapper>
              <StyledInput
                type="email"
                placeholder="Seu email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <IconWrapper>
                <FontAwesomeIcon icon={faLock} />
              </IconWrapper>
              <StyledInput
                type="password"
                placeholder="Sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <StyledButton variant="primary" type="submit" className="w-100 mt-3">
              Login
            </StyledButton>
          </StyledForm>
          <div className="text-center mt-3">
            <Button variant="link" onClick={() => setShowRegisterModal(true)}>
              Não tem uma conta? Registre-se aqui
            </Button>
          </div>
        </Card.Body>
      </StyledCard>

      <StyledModal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3 position-relative">
              <IconWrapper>
                <FontAwesomeIcon icon={faUser} />
              </IconWrapper>
              <StyledInput
                type="text"
                placeholder="Seu nome"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <IconWrapper>
                <FontAwesomeIcon icon={faEnvelope} />
              </IconWrapper>
              <StyledInput
                type="email"
                placeholder="Seu email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 position-relative">
              <IconWrapper>
                <FontAwesomeIcon icon={faLock} />
              </IconWrapper>
              <StyledInput
                type="password"
                placeholder="Sua senha"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </Form.Group>
            <StyledButton variant="primary" type="submit" className="w-100">
              Registrar
            </StyledButton>
          </Form>
        </Modal.Body>
      </StyledModal>
    </StyledContainer>
  );
}

export default LoginPage;
