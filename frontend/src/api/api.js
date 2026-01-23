import axios from 'axios'

// URLs da API (local e produção)
const LOCAL_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006';
const PRODUCTION_API_URL = 'https://backend-eta-five-58.vercel.app'; // URL da API em produção

// Circuit breaker para evitar requisições excessivas quando servidor está offline
let circuitBreakerState = {
  isOpen: false,
  failureCount: 0,
  lastFailureTime: null,
  threshold: 5, // Número de falhas consecutivas antes de abrir o circuit
  timeout: 30000 // 30 segundos antes de tentar novamente
};

/**
 * Verifica se o circuit breaker deve bloquear requisições
 */
const isCircuitBreakerOpen = () => {
  if (!circuitBreakerState.isOpen) return false;
  
  const now = Date.now();
  const timeSinceLastFailure = now - circuitBreakerState.lastFailureTime;
  
  if (timeSinceLastFailure > circuitBreakerState.timeout) {
    // Reset circuit breaker após timeout
    circuitBreakerState.isOpen = false;
    circuitBreakerState.failureCount = 0;
    console.log('🔄 Circuit breaker resetado - tentando reconectar');
    return false;
  }
  
  return true;
};

/**
 * Registra uma falha no circuit breaker
 */
const recordFailure = () => {
  circuitBreakerState.failureCount++;
  circuitBreakerState.lastFailureTime = Date.now();
  
  if (circuitBreakerState.failureCount >= circuitBreakerState.threshold) {
    circuitBreakerState.isOpen = true;
    console.log(`🚨 Circuit breaker ABERTO - ${circuitBreakerState.failureCount} falhas consecutivas`);
  }
};

/**
 * Registra um sucesso no circuit breaker
 */
const recordSuccess = () => {
  if (circuitBreakerState.failureCount > 0) {
    console.log('✅ Conexão restaurada - circuit breaker resetado');
  }
  circuitBreakerState.failureCount = 0;
  circuitBreakerState.isOpen = false;
};

/**
 * Função para verificar se o servidor local está em execução
 * Tenta fazer uma requisição simples com timeout curto
 */
const isLocalServerRunning = async () => {
  try {
    console.log('🔍 Verificando disponibilidade do servidor local...');
    
    // Usar um timeout curto para não bloquear a inicialização do app
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    // Tenta fazer uma requisição simples ao servidor local
    const response = await fetch(`${LOCAL_API_URL}/api/health`, {
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('⚠️ Servidor local não está disponível');
    return false;
  }
};

// Verifica a disponibilidade do servidor local e decide qual URL usar
const determineApiUrl = async () => {
  try {
    const isLocalAvailable = await isLocalServerRunning();

    if (isLocalAvailable) {
      console.log('='.repeat(60));
      console.log('🟢 BACKEND SELECIONADO: LOCAL');
      console.log(`📍 URL: ${LOCAL_API_URL}`);
      console.log('='.repeat(60));
      return LOCAL_API_URL;
    } else {
      console.log('='.repeat(60));
      console.log('🔵 BACKEND SELECIONADO: PRODUÇÃO (VERCEL)');
      console.log(`📍 URL: ${PRODUCTION_API_URL}`);
      console.log('='.repeat(60));
      return PRODUCTION_API_URL;
    }
  } catch (error) {
    console.error('Erro ao determinar URL da API:', error);
    console.log('='.repeat(60));
    console.log('🔵 BACKEND SELECIONADO: PRODUÇÃO (VERCEL) - FALLBACK');
    console.log(`📍 URL: ${PRODUCTION_API_URL}`);
    console.log('='.repeat(60));
    return PRODUCTION_API_URL; // Fallback para produção em caso de erro
  }
};

// Configuração inicial (será atualizada posteriormente)
const apiConfig = {
  // Inicialmente usa a URL de produção, será atualizada se o servidor local estiver disponível
  baseURL: `${PRODUCTION_API_URL}/api`,
  timeout: 10000, // 10 segundos - otimizado para posts
  headers: {
    'Content-Type': 'application/json',
  },
};

// Cria a instância do axios
export const api = axios.create(apiConfig);

// Verifica e configura a URL da API no carregamento
determineApiUrl().then(async (apiUrl) => {
  api.defaults.baseURL = `${apiUrl}/api`;
  console.log(`🔌 API configurada para: ${api.defaults.baseURL}`);

  try {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('backend_connection_alert_shown') === '1') return;

    const resp = await fetch(`${apiUrl}/api/health`, { method: 'GET' });
    const body = await resp.json().catch(() => ({}));
    const dbName = body?.dbName || 'desconhecido';
    const backendLabel = apiUrl === LOCAL_API_URL ? 'LOCAL' : 'VERCEL';
    console.log(`Conectado ao backend ${backendLabel}. Banco: ${dbName}`);
    sessionStorage.setItem('backend_connection_alert_shown', '1');
  } catch (e) {
    // não bloquear o app
  }
});

api.interceptors.request.use((config) => {
  try {
    const method = (config.method || 'get').toUpperCase();
    const url = config.url || '';

    const isChunkInit = typeof url === 'string' && url.includes('posts/media/chunk/init');
    const isChunkAppend = typeof url === 'string' && url.includes('posts/media/chunk/append');
    const isChunkFinish = typeof url === 'string' && url.includes('posts/media/chunk/finish');

    if (isChunkAppend) {
      const index = config?.data?.index;
      const uploadId = config?.data?.uploadId;
      const chunkLen = typeof config?.data?.chunkBase64 === 'string' ? config.data.chunkBase64.length : null;
      console.log('📡 Requisição API:', method, url, { uploadId, index, chunkBase64Length: chunkLen });
    } else if (isChunkInit || isChunkFinish) {
      console.log('📡 Requisição API:', method, url, config.data || {});
    } else {
      // Evita travar o mobile logando bodies grandes acidentalmente.
      const dataType = config.data == null ? 'null' : Array.isArray(config.data) ? 'array' : typeof config.data;
      console.log('📡 Requisição API:', method, url, { dataType });
    }
  } catch (e) {
    // Não quebrar o fluxo por causa de log
    console.log('📡 Requisição API:', (config.method || 'get').toUpperCase(), config.url);
  }

  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('next-auth.session-token') ||
    localStorage.getItem('__Secure-next-auth.session-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.request.use(
  (config) => {
    if (isCircuitBreakerOpen()) {
      console.log('🚫 Requisição bloqueada pelo circuit breaker');
      return Promise.reject(new Error('Circuit breaker aberto - servidor indisponível'));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para gerenciar circuit breaker
api.interceptors.response.use(
  (response) => {
    recordSuccess();
    return response;
  },
  (error) => {
    // Registra falha apenas para erros de conexão
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      recordFailure();
    }
    
    // Log de erro mais limpo
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Erro API:', error.response?.status, error.config?.url?.replace(api.defaults.baseURL, ''), error.response?.data);
    }
    return Promise.reject(error);
  }
);
