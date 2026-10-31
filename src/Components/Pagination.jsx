import React from 'react';  
import './Pagination.css';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-container">
      
      <button
        type="button"
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &larr; Sebelumnya
      </button>

      <div className="page-numbers">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`page-num ${currentPage === page ? 'active' : ''}`}
            disabled={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Selanjutnya &rarr;
      </button>
    </div>
  );
}