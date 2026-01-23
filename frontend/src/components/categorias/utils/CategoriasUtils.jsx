import { useCallback, useEffect, useState } from 'react';
import { categoriasServices } from '../services/CategoriasServices';

export function useCategoriasUtils() {
  const [categorias, setCategorias] = useState([]);
  const [newCategoria, setNewCategoria] = useState({ nome: '', tipo: 'despesa' });
  const [editingId, setEditingId] = useState(null);
  const [editedCategoria, setEditedCategoria] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const clearAlert = useCallback(() => {
    setAlert({ show: false, message: '', variant: 'success' });
  }, []);

  const showAlert = useCallback((message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
  }, []);

  const fetchCategorias = useCallback(async () => {
    try {
      const data = await categoriasServices.getCategorias();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      showAlert('Erro ao buscar categorias', 'danger');
    }
  }, [showAlert]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewCategoria((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await categoriasServices.createCategoria(newCategoria);
        showAlert('Categoria criada com sucesso', 'success');
        setNewCategoria({ nome: '', tipo: 'despesa' });
        await fetchCategorias();
      } catch (error) {
        console.error('Erro ao criar categoria:', error);
        showAlert('Erro ao criar categoria', 'danger');
      }
    },
    [fetchCategorias, newCategoria, showAlert]
  );

  const handleEdit = useCallback((categoria) => {
    setEditingId(categoria?._id);
    setEditedCategoria({ nome: categoria?.nome || '', tipo: categoria?.tipo || 'despesa' });
  }, []);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedCategoria((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveEdit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editingId) return;
      try {
        await categoriasServices.updateCategoria(editingId, editedCategoria);
        showAlert('Categoria atualizada com sucesso', 'success');
        setEditingId(null);
        setEditedCategoria({});
        await fetchCategorias();
      } catch (error) {
        console.error('Erro ao editar categoria:', error);
        showAlert('Erro ao editar categoria', 'danger');
      }
    },
    [editedCategoria, editingId, fetchCategorias, showAlert]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await categoriasServices.deleteCategoria(id);
        showAlert('Categoria removida com sucesso', 'success');
        await fetchCategorias();
      } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        showAlert('Erro ao deletar categoria', 'danger');
      }
    },
    [fetchCategorias, showAlert]
  );

  return {
    categorias,
    newCategoria,
    editingId,
    editedCategoria,
    alert,
    clearAlert,
    fetchCategorias,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleEditChange,
    handleSaveEdit,
    handleDelete,
    setEditingId,
  };
}
