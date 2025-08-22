import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PaginationProps } from '../../types';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5,
}) => {
  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const buttonClass = (isActive: boolean, disabled: boolean = false) => `
    px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
    ${disabled 
      ? 'text-gray-400 cursor-not-allowed' 
      : isActive 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }
  `;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-1">
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={buttonClass(false, currentPage === 1)}
        >
          <ChevronsLeft size={16} />
        </button>
      )}
      
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={buttonClass(false, currentPage === 1)}
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={buttonClass(false)}
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={buttonClass(page === currentPage)}
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={buttonClass(false)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={buttonClass(false, currentPage === totalPages)}
      >
        <ChevronRight size={16} />
      </button>

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={buttonClass(false, currentPage === totalPages)}
        >
          <ChevronsRight size={16} />
        </button>
      )}
    </div>
  );
};