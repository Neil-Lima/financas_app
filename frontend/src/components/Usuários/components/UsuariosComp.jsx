import React, { useRef } from 'react';
import { Row, Col, Card, Button, Form, Alert, Table, Modal, Tabs, Tab, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faKey, 
  faEdit, 
  faCamera, 
  faSignOutAlt, 
  faSun, 
  faMoon, 
  faBell, 
  faBellSlash,
  faTrash,
  faLaptop,
  faMobile,
  faTablet 
} from '@fortawesome/free-solid-svg-icons';
import { UsuariosStyles } from '../styles/UsuariosStyles';
import { useUsuario } from '../utils/UsuariosUtils';
import { useTheme } from '../../../shared/contexts/ThemeContext';

const UsuariosComp = () => {
  const { isDarkMode } = useTheme();
  const {
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
    atualizarPerfil,
    alterarSenha,
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
  } = useUsuario();

  const fotoInputRef = useRef(null);

  // Função para gerar as iniciais do nome do usuário
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Função para gerar uma cor baseada no nome do usuário
  const getAvatarColor = (name) => {
    if (!name) return '#007bff';
    
    const colors = [
      '#007bff', '#28a745', '#dc3545', '#fd7e14', '#6f42c1',
      '#20c997', '#e83e8c', '#6610f2', '#17a2b8', '#ffc107'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para determinar o tipo de dispositivo
  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return faLaptop;
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile')) return faMobile;
    if (ua.includes('tablet')) return faTablet;
    return faLaptop;
  };

  // Manipula o upload de foto
  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFoto(file);
    }
  };

  // Renderiza o header do perfil
  const renderProfileHeader = () => {
    if (!perfil) return null;
    
    const avatarColor = getAvatarColor(perfil.nome);
    const initials = getInitials(perfil.nome);

    return (
      <UsuariosStyles.ProfileHeader>
        <div style={{ position: 'relative' }}>
          {perfil.foto_url ? (
            <UsuariosStyles.ProfileAvatar
              as="img"
              src={perfil.foto_url}
              alt={perfil.nome}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <UsuariosStyles.ProfileAvatar color={avatarColor}>
              {initials}
            </UsuariosStyles.ProfileAvatar>
          )}
          <Button
            variant="light"
            size="sm"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              borderRadius: '50%',
              padding: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            onClick={() => fotoInputRef.current.click()}
          >
            <FontAwesomeIcon icon={faCamera} />
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fotoInputRef}
            style={{ display: 'none' }}
            onChange={handleFotoUpload}
          />
        </div>
        <UsuariosStyles.ProfileInfo isDarkMode={isDarkMode}>
          <h3>{perfil.nome}</h3>
          <p>{perfil.email}</p>
          {perfil.telefone && <p>{perfil.telefone}</p>}
          {perfil.profissao && <p>{perfil.profissao}</p>}
          <div className="mt-2">
            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => setShowPasswordModal(true)}>
              <FontAwesomeIcon icon={faKey} className="me-1" /> Alterar Senha
            </Button>
          </div>
        </UsuariosStyles.ProfileInfo>
      </UsuariosStyles.ProfileHeader>
    );
  };

  // Renderiza a seção de informações pessoais
  const renderInformacoesForm = () => (
    <UsuariosStyles.SettingsSection isDarkMode={isDarkMode}>
      <h5>Informações Pessoais</h5>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={perfilForm.nome}
                onChange={handlePerfilChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={perfilForm.email}
                onChange={handlePerfilChange}
                disabled
              />
              <Form.Text className="text-muted">
                O email não pode ser alterado
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                name="telefone"
                value={perfilForm.telefone}
                onChange={handlePerfilChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Profissão</Form.Label>
              <Form.Control
                type="text"
                name="profissao"
                value={perfilForm.profissao}
                onChange={handlePerfilChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button 
            variant="primary" 
            onClick={atualizarPerfil}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Salvando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </Form>
    </UsuariosStyles.SettingsSection>
  );

  // Renderiza a seção de preferências
  const renderPreferenciasForm = () => {
    if (!preferencias) return null;

    return (
      <UsuariosStyles.SettingsSection isDarkMode={isDarkMode}>
        <h5>Preferências</h5>
        <Form>
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label className="mb-0">Tema</Form.Label>
              <Button 
                variant={isDarkMode ? "light" : "dark"} 
                size="sm"
                onClick={handleToggleTema}
              >
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="me-2" />
                {isDarkMode ? "Tema Claro" : "Tema Escuro"}
              </Button>
            </div>
          </Form.Group>

          <h6 className="mt-4 mb-3">Notificações</h6>
          
          {preferencias.notificacoes && (
            <>
              <Form.Check 
                type="switch"
                id="notif-transacoes"
                label="Notificações de transações"
                checked={preferencias.notificacoes.transacoes}
                onChange={() => handleToggleNotificacoes('transacoes')}
                className="mb-2"
              />
              <Form.Check 
                type="switch"
                id="notif-orcamentos"
                label="Alertas de orçamentos"
                checked={preferencias.notificacoes.orcamentos}
                onChange={() => handleToggleNotificacoes('orcamentos')}
                className="mb-2"
              />
              <Form.Check 
                type="switch"
                id="notif-metas"
                label="Atualizações de metas"
                checked={preferencias.notificacoes.metas}
                onChange={() => handleToggleNotificacoes('metas')}
                className="mb-2"
              />
              <Form.Check 
                type="switch"
                id="notif-sistema"
                label="Notificações do sistema"
                checked={preferencias.notificacoes.sistema}
                onChange={() => handleToggleNotificacoes('sistema')}
              />
            </>
          )}
        </Form>
      </UsuariosStyles.SettingsSection>
    );
  };

  // Renderiza a seção de segurança
  const renderSegurancaForm = () => (
    <UsuariosStyles.SettingsSection isDarkMode={isDarkMode}>
      <h5>Segurança</h5>
      <div className="mb-4">
        <h6>Sessões Ativas</h6>
        <p className="text-muted">Dispositivos onde sua conta está conectada atualmente</p>
        
        {sessoes.length > 0 ? (
          <div>
            <UsuariosStyles.StyledTable isDarkMode={isDarkMode} responsive>
              <thead>
                <tr>
                  <th>Dispositivo</th>
                  <th>Último Acesso</th>
                  <th>Localização</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sessoes.map((sessao) => (
                  <tr key={sessao.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={getDeviceIcon(sessao.userAgent)} className="me-2" />
                        <div>
                          <div>{sessao.browser || 'Navegador desconhecido'}</div>
                          <small className="text-muted">{sessao.os || 'Sistema desconhecido'}</small>
                        </div>
                      </div>
                    </td>
                    <td>{formatDate(sessao.ultimoAcesso)}</td>
                    <td>{sessao.localizacao || 'Desconhecida'}</td>
                    <td>
                      {sessao.atual ? (
                        <Badge bg="success">Sessão Atual</Badge>
                      ) : (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => encerrarSessao(sessao.id)}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Encerrar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </UsuariosStyles.StyledTable>
            
            <div className="mt-3">
              <Button 
                variant="outline-danger" 
                onClick={encerrarOutrasSessoes}
                disabled={isLoading || sessoes.filter(s => !s.atual).length === 0}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Encerrar Todas as Outras Sessões
              </Button>
            </div>
          </div>
        ) : (
          <p>Nenhuma sessão ativa encontrada</p>
        )}
      </div>
      
      <div>
        <h6>Ações de Conta</h6>
        <div className="mt-3">
          <Button variant="outline-primary" onClick={() => setShowPasswordModal(true)}>
            <FontAwesomeIcon icon={faKey} className="me-2" />
            Alterar Senha
          </Button>
          <Button 
            variant="outline-danger" 
            className="ms-3"
            onClick={() => setShowDeleteModal(true)}
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Excluir Conta
          </Button>
        </div>
      </div>
    </UsuariosStyles.SettingsSection>
  );

  // Renderiza o modal de alteração de senha
  const renderPasswordModal = () => (
    <UsuariosStyles.StyledModal
      show={showPasswordModal}
      onHide={() => setShowPasswordModal(false)}
      centered
      isDarkMode={isDarkMode}
    >
      <Modal.Header closeButton>
        <Modal.Title>Alterar Senha</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Senha Atual</Form.Label>
            <Form.Control
              type="password"
              name="senhaAtual"
              value={senhaForm.senhaAtual}
              onChange={handleSenhaChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nova Senha</Form.Label>
            <Form.Control
              type="password"
              name="novaSenha"
              value={senhaForm.novaSenha}
              onChange={handleSenhaChange}
            />
            <Form.Text className="text-muted">
              A senha deve ter no mínimo 8 caracteres, incluindo letras, números e caracteres especiais.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirmar Nova Senha</Form.Label>
            <Form.Control
              type="password"
              name="confirmarSenha"
              value={senhaForm.confirmarSenha}
              onChange={handleSenhaChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={alterarSenha}
          disabled={isLoading}
        >
          {isLoading ? 'Alterando...' : 'Alterar Senha'}
        </Button>
      </Modal.Footer>
    </UsuariosStyles.StyledModal>
  );

  // Renderiza o modal de confirmação de exclusão de conta
  const renderDeleteModal = () => (
    <UsuariosStyles.StyledModal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      centered
      isDarkMode={isDarkMode}
    >
      <Modal.Header closeButton>
        <Modal.Title>Excluir Conta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <FontAwesomeIcon icon={faTrash} size="3x" className="text-danger mb-3" />
          <h5>Tem certeza que deseja excluir sua conta?</h5>
          <p className="text-muted">
            Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
          </p>
        </div>
        <Form>
          <Form.Group>
            <Form.Label>Digite "excluir" para confirmar:</Form.Label>
            <Form.Control
              type="text"
              placeholder="excluir"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancelar
        </Button>
        <Button 
          variant="danger"
          onClick={() => {
            setShowDeleteModal(false);
            showAlert("Esta funcionalidade ainda não está implementada", "warning");
          }}
        >
          Excluir Permanentemente
        </Button>
      </Modal.Footer>
    </UsuariosStyles.StyledModal>
  );

  return (
    <UsuariosStyles.StyledContainer isDarkMode={isDarkMode}>
      {alert.show && (
        <Alert variant={alert.variant} className="mt-3">
          {alert.message}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <h2>
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Perfil de Usuário
          </h2>
        </Col>
      </Row>

      {isLoading && !perfil ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : error && !perfil ? (
        <Alert variant="danger">
          {error}
        </Alert>
      ) : (
        <Row>
          <Col>
            <UsuariosStyles.StyledCard isDarkMode={isDarkMode}>
              <Card.Body>
                {renderProfileHeader()}
                
                <Tabs
                  defaultActiveKey="informacoes"
                  className="mb-4 mt-4"
                >
                  <Tab eventKey="informacoes" title="Informações Pessoais">
                    {renderInformacoesForm()}
                  </Tab>
                  <Tab eventKey="preferencias" title="Preferências">
                    {renderPreferenciasForm()}
                  </Tab>
                  <Tab eventKey="seguranca" title="Segurança">
                    {renderSegurancaForm()}
                  </Tab>
                </Tabs>
              </Card.Body>
            </UsuariosStyles.StyledCard>
          </Col>
        </Row>
      )}

      {renderPasswordModal()}
      {renderDeleteModal()}
    </UsuariosStyles.StyledContainer>
  );
};

export default UsuariosComp; 