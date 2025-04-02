import { formatDateToISO } from '../../../../shared/utils/formatters';

/**
 * Gera o período de datas formatado para uso em relatórios
 * @param {Date} startDate - Data inicial
 * @param {Date} endDate - Data final
 * @returns {Object} Objeto com datas formatadas
 */
const formatDateRange = (startDate, endDate) => {
  return {
    startDate: formatDateToISO(startDate),
    endDate: formatDateToISO(endDate)
  };
};

/**
 * Verifica se o período de datas é válido
 * @param {Date} startDate - Data inicial
 * @param {Date} endDate - Data final
 * @returns {boolean} True se o período for válido
 */
const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end;
};

export const DateRangePickerUtils = {
  formatDateRange,
  isValidDateRange
}; 