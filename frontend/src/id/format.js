/**
 * Converte qualquer valor em string de ID.
 * @param {*} id Valor que representa um ID (string ou número).
 * @returns {string} string formatada ou string vazia se valor for null ou undefined.
 */
export function format(id) {
  if (id === null || id === undefined) return '';
  return id.toString();
} 