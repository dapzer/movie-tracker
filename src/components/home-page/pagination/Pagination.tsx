import React, { FC } from 'react';
import { usePagination } from '../../../hooks/usePagination';
import styles from './pagination.module.scss';
import { PaginationOptions } from '../../../types/PaginationOptions';

interface Props {
  paginationInfo: {
    currentPage: number;
    handlePage: (arg0: number) => void;
    totalPages?: number;
    options: PaginationOptions;
  };
}

const Pagination: FC<Props> = ({ paginationInfo }) => {
  // * Получение массива страниц для отрисовки
  const { pages } = usePagination({
    currentPage: paginationInfo.currentPage,
    totalPages: paginationInfo.totalPages || 1,
    options: paginationInfo.options,
  });

  // * Функция для изменения страницы
  const pageHandler = (page: number) => {
    paginationInfo.handlePage(page);
  };

  return (
    <div className={styles['pagination__pages']}>
      <button
        hidden={!(paginationInfo.currentPage > paginationInfo.options.pageToShow)}
        className={`${styles['pagination__page']}`}
        onClick={() => pageHandler(1)}
      >
        В начало
      </button>

      {pages.map((page) => (
        <button
          className={`${styles['pagination__page']} ${
            page === paginationInfo.currentPage && styles['pagination__page_active']
          }`}
          key={page}
          onClick={() => pageHandler(page)}
        >
          {page}
        </button>
      ))}

      <button
        hidden={
          !(
            paginationInfo.currentPage <
            (paginationInfo?.totalPages || 0) - paginationInfo.options.pageToShow
          )
        }
        className={`${styles['pagination__page']}`}
        onClick={() => pageHandler(paginationInfo.totalPages || 1)}
      >
        В конец
      </button>
    </div>
  );
};

export default Pagination;
