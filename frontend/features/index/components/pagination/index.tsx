import React from 'react';
import styles from './index.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    // 現在のページの前後に表示するページ数
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        if (range.length > 0 && i - (range[range.length - 1] as number) > 1) {
          range.push('...');
        }
        range.push(i);
      }
    }
    return range;
  };

  return (
    <nav className={styles.Pagination} role="navigation" aria-label="ページネーション">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageButton}
        aria-label="前のページへ"
      >
        前へ
      </button>

      <div className={styles.pageNumbers}>
        {getPageNumbers().map((number, index) =>
          number === '...' ? (
            <span key={`dots-${index}`} className={styles.dots}>
              ...
            </span>
          ) : (
            <button
              key={number}
              onClick={() => onPageChange(number as number)}
              className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
              aria-current={currentPage === number ? 'page' : undefined}
            >
              {number}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
        aria-label="次のページへ"
      >
        次へ
      </button>
    </nav>
  );
};

export default Pagination;
