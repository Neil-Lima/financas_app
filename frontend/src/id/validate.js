/**
 * Valida se uma string pode ser usada como ID.
 * @param {string} id string a ser validada
 * @returns {boolean} indica se é um ID válido
 */
export function validate(id) {
  // Verificar se o id existe
  if (!id) return false;
  
  // Verificar se é um ObjectId MongoDB (24 caracteres hexadecimais)
  const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
  
  // Validação rigorosa, aceitando apenas IDs no formato MongoDB
  return OBJECT_ID_REGEX.test(id.toString());
} 