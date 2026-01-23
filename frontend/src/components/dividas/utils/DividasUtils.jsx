import { useCallback, useEffect, useState } from 'react';
import { dividasServices } from '../services/DividasServices';

export function useDividasUtils() {
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchResumo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dividasServices.getResumo();
      setResumo(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumo();
  }, [fetchResumo]);

  return { resumo, loading, fetchResumo };
}
