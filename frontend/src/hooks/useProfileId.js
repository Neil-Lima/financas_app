import { useMemo } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Hook para extrair o profileId da URL e identificar o contexto de perfil.
 * @param {string|undefined} overrideProfileId - Permite sobrescrever o profileId manualmente.
 * @returns {{ profileId: string | null, isOwnProfile: boolean }}
 */
export function useProfileId(overrideProfileId) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const { userId } = useAuth();

  // Calcula o profileId de forma memorizada
  const profileId = useMemo(() => {
    if (overrideProfileId !== undefined) {
      return overrideProfileId;
    }
    const idFromQuery = searchParams.get('id');
    if (idFromQuery) return idFromQuery;

    if (params?.id) {
      return params.id;
    }

    const match = (location?.pathname || '').match(/\/(profile|user)\/([\w-]+)/);
    return match?.[2] || null;
  }, [overrideProfileId, location?.pathname, params?.id, searchParams]);

  // Calcula isOwnProfile de forma memorizada
  const isOwnProfile = useMemo(() => {
    return !!(profileId && userId && profileId === userId);
  }, [profileId, userId]);

  return { profileId, isOwnProfile };
}
