import { api } from '../api/api';
import { validate } from '../id/validate';
import { format } from '../id/format';

// Re-exportar utilitários de ID para uso nos services
export { validate, format };

// =============================================================================
// FUNÇÕES DE AUTENTICAÇÃO E IDENTIFICAÇÃO DO USUÁRIO
// =============================================================================

/**
 * Obtém o ID do usuário atual de várias fontes possíveis
 * @returns {string|null} ID do usuário ou null se não estiver autenticado
 */
export function ensureUserId() {
  // Tenta extrair ID da sessão NextAuth
  try {
    const nextAuthSession = localStorage.getItem('nextauth.session');
    if (nextAuthSession) {
      const session = JSON.parse(nextAuthSession);
      const idFromSession = session?.user?.id;
      if (idFromSession) return String(idFromSession);
    }
  } catch (e) {
    console.error('[crudService] Erro ao parsear nextauth.session:', e);
  }

  // Tenta decodificar o JWT para extrair o sub/id
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const idFromToken = payload.sub || payload.id || payload.userId;
        if (idFromToken) return String(idFromToken);
      }
    }
  } catch (e) {
    console.error('[crudService] Erro ao decodificar token:', e);
  }

  // Tenta obter do localStorage diretamente (fallback)
  try {
    const userId = localStorage.getItem('userId');
    if (userId) return String(userId);
  } catch (e) {
    console.error('[crudService] Erro ao ler userId do localStorage:', e);
  }

  // Usuário não autenticado ou ID não disponível
  return null;
}

/**
 * Verifica se o usuário atual é proprietário de um recurso
 * @param {string} resourceId - ID do recurso/autor para comparar
 * @returns {boolean} - true se o usuário for o proprietário
 */
export function isCurrentUserOwner(resourceId) {
  if (!resourceId) return false;
  
  const userId = ensureUserId();
  if (!userId) return false;
  
  // Comparação direta dos IDs como strings
  return String(userId) === String(resourceId);
}

/**
 * Obtém o token de autenticação atual
 * @returns {string|null} - Token JWT ou null se não estiver autenticado
 */
export function getAuthToken() {
  // Sincroniza o token do next-auth para o localStorage
  try {
    const session = JSON.parse(localStorage.getItem('nextauth.session') || '{}');
    const accessToken = session?.user?.accessToken;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      return accessToken;
    }
  } catch (e) {}
  
  // Tenta obter o token do localStorage
  return localStorage.getItem('token');
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean} - true se estiver autenticado
 */
export function isAuthenticated() {
  return !!ensureUserId() && !!getAuthToken();
}

/**
 * Define cabeçalhos de autorização para requisições
 * @returns {object} - Objeto com cabeçalhos de autorização
 */
export function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Sincroniza o token do next-auth para o localStorage['token'] (legado)
function syncNextAuthToken() {
  getAuthToken(); // Usa a nova função que já faz a sincronização
}

// Sincroniza o token do next-auth para o localStorage['token']
function syncNextAuthTokenLegacy() {
  try {
    const session = JSON.parse(localStorage.getItem('nextauth.session') || '{}');
    const accessToken = session?.user?.accessToken;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }
  } catch (e) {}
}

/**
 * Sincroniza o ID do usuário da sessão NextAuth para o localStorage
 * Isso garante compatibilidade com componentes que ainda usam localStorage.getItem('userId')
 */
export function syncUserIdToLocalStorage() {
  try {
    const session = JSON.parse(localStorage.getItem('nextauth.session') || '{}');
    const userId = session?.user?.id;
    if (userId) {
      localStorage.setItem('userId', userId);
      console.log('[crudService] ID do usuário sincronizado para localStorage:', userId);
    }
  } catch (e) {
    console.error('[crudService] Erro ao sincronizar ID do usuário:', e);
  }
}

/**
 * Lista recursos com parâmetros de consulta.
 * @param {string} resource Nome do recurso (ex: 'posts').
 * @param {object} params Query params (page, limit, filters).
 * @returns {Promise<any>} Dados retornados pelo servidor.
 */
export function list(resource, params) {
  syncNextAuthToken();
  syncUserIdToLocalStorage();
  // Ajusta rota de membros de comunidade
  const membersMatch = resource.match(/^communities\/([^\/]+)\/members$/);
  const endpoint = membersMatch
    ? `/communities/members/${membersMatch[1]}`
    : `/${resource}`;
  return api.get(endpoint, { params }).then(res => res.data);
}

/**
 * Busca um recurso por ID.
 * @param {string} resource Nome do recurso.
 * @param {string} id ID do recurso.
 * @returns {Promise<any>}
 */
export function getById(resource, id) {
  syncNextAuthToken();
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  return api.get(`/${resource}/${formattedId}`).then(res => res.data)
    .catch(error => {
      console.error(`Erro ao buscar ${resource} com ID ${formattedId}:`, error);
      throw error;
    });
}

/**
 * Cria um novo recurso com suporte a FormData para uploads de arquivo.
 * @param {string} resource Nome do recurso.
 * @param {object|FormData} data Payload de criação ou FormData.
 * @returns {Promise<any>}
 */
export function create(resource, data) {
  syncNextAuthToken();

  if (data instanceof FormData) {
    // Para FormData, precisamos deixar o Axios configurar automaticamente o Content-Type
    return api.post(`/${resource}`, data, {
      headers: {
        // Remover Content-Type para uploads de arquivo, permitindo que o Axios defina corretamente como multipart/form-data
        'Content-Type': undefined
      }
    }).then(res => res.data);
  } else {
    // Comportamento padrão para objetos JSON
    return api.post(`/${resource}`, data).then(res => res.data);
  }
}

/**
 * Aplica uma ação específica a um recurso (ex: featured, published).
 * @param {string} resource Nome do recurso (ex: 'gallery').
 * @param {string} id ID do recurso.
 * @param {string} action A ação a ser executada (ex: 'featured').
 * @param {object} data Payload para a ação.
 * @returns {Promise<any>}
 */
export function patchAction(resource, id, action, data) {
  syncNextAuthToken();
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  const endpoint = `/${resource}/${formattedId}/${action}`;
  return api.patch(endpoint, data).then(res => res.data);
}

/**
 * Atualiza um recurso existente.
 * @param {string} resource Nome do recurso.
{{ ... }}
 * @param {string} id ID do recurso.
 * @param {object} data Payload de atualização.
 * @returns {Promise<any>}
 */
export function update(resource, id, data) {
  syncNextAuthToken();
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  return api.patch(`/${resource}/${formattedId}`, data).then(res => res.data);
}

/**
 * Remove um recurso.
 * @param {string} resource Nome do recurso.
 * @param {string} id ID do recurso.
 * @returns {Promise<any>}
 */
export function remove(resource, id) {
  syncNextAuthToken();
  // Monta URL sem id extra se id não for fornecido
  let url = `/${resource}`;
  if (id) {
    if (!validate(id)) throw new Error(`ID inválido: ${id}`);
    const formattedId = format(id);
    url += `/${formattedId}`;
  }
  return api.delete(url).then(res => res.data);
}

/**
 * Conta número de recursos.
 * @param {string} resource Nome do recurso.
 * @param {object} params Query params (filtros, paginação etc.).
 * @returns {Promise<number>} Valor retornado pelo servidor.
 */
export function count(resource, params) {
  syncNextAuthToken();
  return api.get(`/${resource}/count`, { params }).then(res => res.data);
}

/**
 * Busca recursos com full-text ou filtros avançados.
 * @param {string} resource Nome do recurso.
 * @param {string} query String de busca (q=).
 * @param {object} params Parâmetros extras de query.
 * @returns {Promise<any>} Dados retornados pelo servidor.
 */
export function search(resource, query, params) {
  syncNextAuthToken();
  return api.get(`/${resource}/search`, { params: { q: query, ...params } }).then(res => res.data);
}

/**
 * Recupera opções suportadas pelo recurso (OPTIONS HTTP).
 * @param {string} resource Nome do recurso.
 * @returns {Promise<any>} Cabeçalhos ou corpo da resposta.
 */
export function options(resource) {
  syncNextAuthToken();
  return api.options(`/${resource}`).then(res => res.data);
}

/**
 * Checa existência de um recurso via HEAD HTTP.
 * @param {string} resource Nome do recurso.
 * @param {string} id ID do recurso.
 * @returns {Promise<any>} Cabeçalhos da resposta.
 */
export function head(resource, id) {
  syncNextAuthToken();
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  return api.head(`/${resource}/${formattedId}`).then(res => res.headers);
}

/**
 * Cria vários recursos em lote.
 * @param {string} resource Nome do recurso.
 * @param {Array} items Lista de payloads para criação.
 * @returns {Promise<any>} Dados retornados pelo servidor.
 */
export function bulkCreate(resource, items) {
  syncNextAuthToken();
  return api.post(`/${resource}/bulk`, items).then(res => res.data);
}

/**
 * Atualiza vários recursos em lote.
 * @param {string} resource Nome do recurso.
 * @param {Array} updates Lista de objetos { id, data }.
 * @returns {Promise<any>} Dados retornados pelo servidor.
 */
export function bulkUpdate(resource, updates) {
  syncNextAuthToken();
  return api.patch(`/${resource}/bulk`, updates).then(res => res.data);
}

/**
 * Remove vários recursos em lote.
 * @param {string} resource Nome do recurso.
 * @param {Array} ids Lista de IDs a remover.
 * @returns {Promise<any>} Dados retornados pelo servidor.
 */
export function bulkDelete(resource, ids) {
  syncNextAuthToken();
  return api.delete(`/${resource}/bulk`, { data: ids }).then(res => res.data);
}

/**
 * Realiza uma requisição HTTP personalizada para qualquer endpoint da API.
 * @param {string} method - Método HTTP (get, post, put, patch, delete).
 * @param {string} path - Caminho completo após a barra inicial.
 * @param {object} data - Dados a serem enviados no corpo da requisição.
 * @param {object} config - Configurações adicionais para a requisição.
 * @returns {Promise<any>} - Dados da resposta da API.
 */
export function customRequest(method, path, data = null, config = {}) {
  syncNextAuthToken();
  const methodLower = method.toLowerCase();
  
  // Métodos que aceitam um body (dados)
  if (['post', 'put', 'patch'].includes(methodLower)) {
    // Evita enviar o literal "null" como corpo JSON quando nenhum dado é fornecido
    const payload = data == null ? {} : data;
    return api[methodLower](`/${path}`, payload, config).then(res => res.data);
  }
  
  // Métodos GET e HEAD: os parâmetros vão na query string
  if (['get', 'head'].includes(methodLower)) {
    return api[methodLower](`/${path}`, config).then(res => 
      methodLower === 'head' ? res.headers : res.data
    );
  }
  
  // Método DELETE: pode ter body em alguns casos
  if (methodLower === 'delete') {
    const payload = data == null ? {} : data;
    return api.delete(`/${path}`, { ...config, data: payload }).then(res => res.data);
  }
  
  throw new Error(`Método HTTP não suportado: ${method}`);
}

/**
 * Upsert: cria ou atualiza um recurso por ID via PUT.
 * @param {string} resource Nome do recurso.
 * @param {string} id ID do recurso.
 * @param {object} data Payload para criação/atualização.
 * @returns {Promise<any>} Dados retornados pelo servidor.
 */
export function upsert(resource, id, data) {
  syncNextAuthToken();
  if (!validate(id)) throw new Error(`ID inválido: ${id}`);
  const formattedId = format(id);
  return api.put(`/${resource}/${formattedId}`, data).then(res => res.data);
}

// =============================================================================
// PROCESSAMENTO DE IMAGENS E BASE64
// =============================================================================

/**
 * Verifica se uma string é uma imagem base64 válida
 * @param {string} base64String - String base64 a ser validada
 * @returns {boolean} - Verdadeiro se for uma imagem base64 válida
 */
export function isValidImageBase64(base64String) {
  if (!base64String) return false;
  
  // Verifica o padrão data:image
  const regex = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
  return regex.test(base64String);
}

/**
 * Extrai o tipo MIME de uma string base64
 * @param {string} base64String - String base64 
 * @returns {string|null} - Tipo MIME ou null se inválido
 */
export function getImageMimeType(base64String) {
  if (!base64String) return null;
  
  const matches = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  return matches ? matches[1] : null;
}

/**
 * Retorna um URL para a imagem, suportando base64 ou URL regular
 * @param {string} imageData - String base64 ou URL da imagem
 * @param {object} options - Opções adicionais
 * @returns {string} - URL processada para uso no atributo src
 */
export function getImageSrc(imageData, options = {}) {
  if (!imageData) {
    return options.fallbackImage || '/images/placeholder.png';
  }
  
  // Se já for uma URL base64 ou uma URL externa
  if (imageData.startsWith('data:') || imageData.startsWith('http')) {
    return imageData;
  }
  
  // Usa a URL da API do axios (configurada dinamicamente em api.js)
  const apiBaseURL = api.defaults.baseURL;
  return `${apiBaseURL}${imageData.startsWith('/') ? '' : '/'}${imageData}`;
}

/**
 * Estima o tamanho em bytes de uma string base64
 * @param {string} base64String - String base64
 * @returns {number} - Tamanho aproximado em bytes
 */
export function getBase64ImageSize(base64String) {
  if (!base64String) return 0;
  
  // Remove o cabeçalho da string base64
  const base64Data = base64String.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, '');
  // Fórmula para calcular o tamanho aproximado em bytes
  return Math.round((base64Data.length * 3) / 4);
}

/**
 * Formata o tamanho da imagem em uma representação legível
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} - Tamanho formatado (ex: "1.5 MB")
 */
export function formatImageSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Converte uma imagem File/Blob para base64
 * @param {File|Blob} file - Arquivo de imagem
 * @returns {Promise<string>} - Promise com a string base64
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Logger de debug para uploads de imagem
 * Ajuda a diagnosticar diferenças entre desktop e mobile
 * @param {string} context - Descrição do ponto do fluxo (ex: 'handleFileSelect', 'handleFileUpload')
 * @param {File|Blob} file - Arquivo/imagem envolvido
 * @param {object} extra - Dados extras opcionais
 */
export function logImageUploadDebug(context, file, extra = {}) {
  try {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'no-navigator';
    console.log('🧩 [ImageUploadDebug]', {
      context,
      fileName: file && file.name,
      fileSize: file && file.size,
      fileType: file && file.type,
      userAgent: ua,
      timestamp: new Date().toISOString(),
      ...extra,
    });
  } catch (e) {
    console.warn('[ImageUploadDebug] Falha ao logar debug:', e);
  }
}

/**
 * Pré-carrega uma imagem
 * @param {string} src - URL da imagem
 * @returns {Promise<boolean>} - True quando a imagem estiver carregada
 */
export function preloadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = getImageSrc(src);
  });
}

/**
 * Normaliza arquivos de imagem, convertendo formatos móveis (HEIC/HEIF) para JPEG
 * @param {File} file - Arquivo de imagem
 * @returns {Promise<File>} - Promise com o arquivo normalizado
 */
export async function normalizeImageFile(file) {
  if (!file) {
    throw new Error('Arquivo não fornecido');
  }

  // Se não for HEIC/HEIF, retorna o arquivo original
  const isHEIC = file.type === 'image/heic' || file.type === 'image/heif' || 
                 file.name.toLowerCase().endsWith('.heic') || 
                 file.name.toLowerCase().endsWith('.heif');

  if (!isHEIC) {
    return file;
  }

  try {
    // Tenta importar heic2any dinamicamente
    let heic2any;
    try {
      heic2any = (await import('heic2any')).default;
    } catch (importError) {
      console.warn('heic2any não disponível, usando arquivo original:', importError);
      return file;
    }

    // Converte HEIC/HEIF para JPEG
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8
    });

    // Cria novo arquivo com nome atualizado
    const convertedFile = new File(
      [convertedBlob], 
      file.name.replace(/\.(heic|heif)$/i, '.jpg'),
      { type: 'image/jpeg' }
    );

    console.log(' Arquivo HEIC/HEIF convertido para JPEG:', convertedFile.name);
    return convertedFile;

  } catch (error) {
    console.warn('Falha na conversão HEIC/HEIF, usando arquivo original:', error);
    return file;
  }
}