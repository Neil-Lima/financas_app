/**
 * Constantes para os endpoints da API
 */
export const API_ENDPOINTS = {
  BASE_URL: 'https://financas-app-kappa.vercel.app/api',
  
  // Endpoints de Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  
  // Endpoints de Contas
  CONTAS: {
    LISTAR: '/contas',
    DETALHE: (id) => `/contas/${id}`,
    CRIAR: '/contas',
    ATUALIZAR: (id) => `/contas/${id}`,
    DELETAR: (id) => `/contas/${id}`,
    SALDO: '/contas/saldo'
  },
  
  // Endpoints de Transações
  TRANSACOES: {
    LISTAR: '/transacoes',
    FILTRAR: '/transacoes/filtrar',
    POR_PERIODO: '/transacoes/periodo',
    POR_CATEGORIA: '/transacoes/categoria',
    RESUMO: '/transacoes/resumo'
  },
  
  // Endpoints de Relatórios
  RELATORIOS: {
    COMPLETO: '/relatorios/completo',
    TRANSACOES: '/relatorios/transacoes',
    ORCAMENTOS: '/relatorios/orcamentos',
    METAS: '/relatorios/metas',
    DESPESAS: '/relatorios/despesas',
    FINANCIAMENTOS: '/relatorios/financiamentos',
    ESTOQUE: '/relatorios/estoque',
    FLUXO_CAIXA: '/relatorios/fluxo-caixa',
    PDF: '/relatorios/pdf',
    EXCEL: '/relatorios/excel'
  },
  
  // Endpoints de Usuários
  USUARIOS: {
    PERFIL: '/usuarios/perfil',
    ALTERAR_SENHA: '/usuarios/alterar-senha',
    PREFERENCIAS: '/usuarios/preferencias',
    UPLOAD_FOTO: '/usuarios/foto',
    SESSOES: '/usuarios/sessoes',
    SESSAO: (id) => `/usuarios/sessoes/${id}`,
    OUTRAS_SESSOES: '/usuarios/sessoes/outras'
  }
}; 