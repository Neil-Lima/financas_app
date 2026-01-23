import { customRequest } from '../../../services/crudService';

export const loginServices = {
  login: (email, senha) => customRequest('POST', 'usuarios/login', { email, senha }),
  register: (nome, email, senha) => customRequest('POST', 'usuarios/register', { nome, email, senha }),
};
