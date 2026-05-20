'use client';

interface BdPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
  className?: string;
}

export default function BdPagination({
  page,
  totalPages,
  onPageChange,
  totalResults,
  className = '',
}: BdPaginationProps) {
  return (
    <div className={`bd-pagination animate-[bd-fade-up_200ms_ease-out]${className ? ` ${className}` : ''}`}>
      <button
        className="bd-pagination-btn"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        type="button"
      >
        Anterior
      </button>

      <span className="bd-pagination-info">
        Página {page + 1} de {totalPages}
        {totalResults !== undefined && <> ({totalResults} resultados)</>}
      </span>

      <button
        className="bd-pagination-btn"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        type="button"
      >
        Siguiente
      </button>
    </div>
  );
}
