import { useMemo } from 'react';
import { ensureUserId } from '../services/crudService';

/**
 * Hook centralizado para autenticação e sessão do usuário
 * Retorna user, userId, isAuthenticated, status e session
 */
export function useAuth() {
  const session = null;
  const status = 'unauthenticated';

  // ✅ Memoizar o cálculo do userId para evitar re-renders
  const userId = useMemo(() => {
    let id = null;

    if (typeof window === 'undefined') {
      return null;
    }

    try {
      id = ensureUserId();
    } catch (error) {
      id = null;
    }

    if (!id) {
      try {
        id = localStorage.getItem('userId');
      } catch (e) {
        id = null;
      }
    }

    return id;
  }, []);

  // ✅ Memoizar isAuthenticated com lógica melhorada
  const isAuthenticated = useMemo(() => {
    return !!userId;
  }, [userId]);

  // Log reduzido apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    // Apenas logar mudanças significativas
    const logKey = `${status}-${!!userId}-${!!session}`;
    if (!window.__lastAuthLog || window.__lastAuthLog !== logKey) {
      console.log('useAuth - Sessão e userId:', {
        session: session,
        userId: userId,
        userIdType: typeof userId,
        status: status,
        isAuthenticated
      });
      window.__lastAuthLog = logKey;
    }
  }

  return {
    user: session?.user || null,
    userId,
    isAuthenticated,
    status, // 'loading', 'authenticated', 'unauthenticated'
    session,
  };
}
