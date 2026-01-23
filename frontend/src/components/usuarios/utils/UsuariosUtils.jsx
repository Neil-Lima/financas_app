import { useCallback, useEffect, useState } from 'react';
import { usuariosServices } from '../services/UsuariosServices';

export function useUsuariosUtils() {
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = useCallback(async () => {
    try {
      const data = await usuariosServices.getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const deleteUsuario = useCallback(async (id) => {
    try {
      await usuariosServices.deleteUsuario(id);
      await fetchUsuarios();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  }, [fetchUsuarios]);

  const deleteAllUsers = useCallback(async () => {
    try {
      await usuariosServices.deleteAllUsers();
      await fetchUsuarios();
    } catch (error) {
      console.error('Erro ao deletar todos os usuários:', error);
    }
  }, [fetchUsuarios]);

  return {
    usuarios,
    fetchUsuarios,
    deleteUsuario,
    deleteAllUsers,
  };
}
