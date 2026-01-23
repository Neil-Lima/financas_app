import { customRequest, list, remove } from '../../../services/crudService';

export const usuariosServices = {
  getUsuarios: () => list('usuarios'),
  deleteUsuario: (id) => remove('usuarios', id),
  deleteAllUsers: () => customRequest('DELETE', 'usuarios/deleteAll'),
};
