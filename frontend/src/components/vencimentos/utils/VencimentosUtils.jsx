import { useCallback, useEffect, useState } from 'react';
import { vencimentosServices } from '../services/VencimentosServices';

export function useVencimentosUtils() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVencimentos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vencimentosServices.listVencimentos();
      setItens(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVencimentos();
  }, [fetchVencimentos]);

  return { itens, loading, fetchVencimentos };
}
