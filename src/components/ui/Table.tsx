import React from 'react';
import { TableColumn, TableData } from '../../types';

interface TableProps {
  columns: TableColumn[];
  data: TableData[];
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  striped = false,
  hoverable = true,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700`}>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`
                ${striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800' : ''}
                ${hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                transition-colors duration-150
              `}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
};