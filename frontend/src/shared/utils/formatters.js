/**
 * Formata um valor para o formato de moeda brasileira (BRL)
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado em BRL
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formata uma data para o formato brasileiro
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data no formato DD/MM/YYYY
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Formata uma data para o formato ISO (YYYY-MM-DD)
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data no formato YYYY-MM-DD
 */
export const formatDateToISO = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

/**
 * Trunca um texto para o tamanho especificado
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo do texto
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza a primeira letra de uma string
 * @param {string} text - Texto a ser capitalizado
 * @returns {string} Texto com a primeira letra maiúscula
 */
export const capitalizeFirstLetter = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}; 