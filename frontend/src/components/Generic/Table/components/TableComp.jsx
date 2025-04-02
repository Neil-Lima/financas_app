import React from 'react';
import { Table } from 'react-bootstrap';
import { TableStyles } from '../styles/TableStyles';
import { useTheme } from '../../../../shared/contexts/ThemeContext';

const TableComp = ({ 
  columns, 
  data, 
  striped = true, 
  hover = true, 
  responsive = true,
  renderCustomRow 
}) => {
  const { isDarkMode } = useTheme();

  return (
    <TableStyles.StyledTable 
      striped={striped} 
      hover={hover} 
      responsive={responsive} 
      $isDarkMode={isDarkMode}
    >
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((row, rowIndex) => (
            renderCustomRow ? (
              renderCustomRow(row, rowIndex)
            ) : (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={column.className || ''}>
                    {column.cell ? column.cell(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            )
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center">
              Nenhum dado encontrado
            </td>
          </tr>
        )}
      </tbody>
    </TableStyles.StyledTable>
  );
};

export default TableComp; 