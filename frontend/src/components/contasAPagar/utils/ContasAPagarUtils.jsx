import { useCallback, useEffect, useState } from 'react';
import { contasAPagarServices } from '../services/ContasAPagarServices';

export function useContasAPagarUtils() {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [novo, setNovo] = useState({ descricao: '', valor: '', vencimento: '', status: 'pendente' });
  const [editingId, setEditingId] = useState(null);
  const [edited, setEdited] = useState({});

  const fetchContas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contasAPagarServices.listContasAPagar();
      setContas(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContas();
  }, [fetchContas]);

  const handleNovoChange = useCallback((e) => {
    const { name, value } = e.target;
    setNovo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmitNovo = useCallback(async () => {
    const payload = {
      descricao: String(novo.descricao || '').trim(),
      valor: Number(novo.valor),
      vencimento: new Date(novo.vencimento).toISOString(),
      status: novo.status || 'pendente',
    };

    const created = await contasAPagarServices.createContaAPagar(payload);
    setContas((prev) => [created, ...prev]);
    setNovo({ descricao: '', valor: '', vencimento: '', status: 'pendente' });
  }, [novo]);

  const startEdit = useCallback((conta) => {
    setEditingId(conta._id);
    const date = conta?.vencimento ? new Date(conta.vencimento) : null;
    const yyyy = date ? date.getFullYear() : '';
    const mm = date ? String(date.getMonth() + 1).padStart(2, '0') : '';
    const dd = date ? String(date.getDate()).padStart(2, '0') : '';

    setEdited({
      descricao: conta.descricao || '',
      valor: conta.valor ?? '',
      vencimento: date ? `${yyyy}-${mm}-${dd}` : '',
      status: conta.status || 'pendente',
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEdited({});
  }, []);

  const handleEditedChange = useCallback((e) => {
    const { name, value } = e.target;
    setEdited((prev) => ({ ...prev, [name]: value }));
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingId) return;
    const payload = {
      descricao: String(edited.descricao || '').trim(),
      valor: Number(edited.valor),
      vencimento: new Date(edited.vencimento).toISOString(),
      status: edited.status || 'pendente',
    };

    const updated = await contasAPagarServices.updateContaAPagar(editingId, payload);
    setContas((prev) => prev.map((c) => (c._id === editingId ? updated : c)));
    cancelEdit();
  }, [editingId, edited, cancelEdit]);

  const deleteConta = useCallback(async (id) => {
    await contasAPagarServices.deleteContaAPagar(id);
    setContas((prev) => prev.filter((c) => c._id !== id));
  }, []);

  return {
    contas,
    loading,
    novo,
    editingId,
    edited,
    fetchContas,
    handleNovoChange,
    handleSubmitNovo,
    startEdit,
    cancelEdit,
    handleEditedChange,
    saveEdit,
    deleteConta,
  };
}
