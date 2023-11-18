import { usePagination } from '@/hooks/usePagination';
import styles from './ui-pagination.module.scss';
import { PaginationOptions } from '@/types/PaginationOptions';
import useTranslation from 'next-translate/useTranslation';
import clsx from 'clsx';

interface UiPaginationProps {
  paginationInfo: {
    currentPage: number;
    handlePage: (arg0: number) => void;
    totalPages?: number;
    options: PaginationOptions;
  };
}

export const UiPagination = (props: UiPaginationProps) => {
  const { paginationInfo } = props;
  const { t } = useTranslation('buttons');

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
    <div className={styles['body']}>
      <button hidden={!(paginationInfo.currentPage > paginationInfo.options.pageToShow)} className={styles['item']} onClick={() => pageHandler(1)}>
        {t('paginationStart')}
      </button>

      <div className={styles['list']}>
        {pages.map((page) => (
          <button
            className={clsx(styles['item'], {
              [styles['item_active']]: page === paginationInfo.currentPage,
            })}
            key={page}
            onClick={() => pageHandler(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        hidden={!(paginationInfo.currentPage < (paginationInfo?.totalPages || 0) - paginationInfo.options.pageToShow)}
        className={styles['item']}
        onClick={() => pageHandler(paginationInfo.totalPages || 1)}
      >
        {t('paginationEnd')}
      </button>
    </div>
  );
};