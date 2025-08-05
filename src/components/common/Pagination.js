import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 0; i < 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
          currentPage === 0 
            ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed' 
            : 'bg-white text-secondary-600 hover:bg-primary-500 hover:text-white border border-secondary-200'
        }`}
        onClick={handlePrevPage}
        disabled={currentPage === 0}
      >
        <FaChevronLeft className="text-sm" />
        Trước
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-lg font-medium transition-colors duration-300 ${
              page === currentPage
                ? 'bg-primary-500 text-white'
                : page === '...'
                ? 'text-secondary-400 cursor-default'
                : 'bg-white text-secondary-600 hover:bg-primary-500 hover:text-white border border-secondary-200'
            }`}
            onClick={() => handlePageClick(page)}
            disabled={page === '...'}
          >
            {page === '...' ? '...' : page + 1}
          </button>
        ))}
      </div>

      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
          currentPage === totalPages - 1 
            ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed' 
            : 'bg-white text-secondary-600 hover:bg-primary-500 hover:text-white border border-secondary-200'
        }`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages - 1}
      >
        Sau
        <FaChevronRight className="text-sm" />
      </button>
    </div>
  );
};

export default Pagination; 