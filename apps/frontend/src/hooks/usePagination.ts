import { useEffect, useState } from 'react';
import { PaginationOptions } from '@/types/PaginationOptions';

interface Pagination {
  currentPage: number;
  totalPages: number;
  options: PaginationOptions;
}

// * Генерация массива номеров страниц для отрисовки
const generateRange = (startPoint: number, endPoint: number) => {
  let pages: number[] = [];

  for (let i = startPoint; i <= endPoint; i++) {
    pages.push(i);
  }

  return pages;
};

export const usePagination = ({ currentPage, totalPages, options }: Pagination) => {
  const [startPoint, setStartPoint] = useState(1);
  const [endPoint, setEndPoint] = useState(1);

  // * Является ли следующий рейндж страниц последним
  const isLast = currentPage + options.pageToShow - options.pagesOnSides >= totalPages;
  // * Находиться ли рейндж близко к первой странице
  const isFirst = currentPage < options.pageToShow - options.pagesOnSides;
  // * Проверяем достаточно ли страниц
  const isSmallerToShow = options.pageToShow >= totalPages;

  // * Устанавливаем рейндж страниц
  const generatePoints = () => {
    if (isSmallerToShow) {
      setStartPoint(1);
      setEndPoint(totalPages);
      return;
    }

    if (isFirst) {
      setStartPoint(1);
      setEndPoint(options.pageToShow);
      return;
    }

    if (isLast) {
      setStartPoint(totalPages - options.pageToShow + 1);
      setEndPoint(totalPages);
      return;
    }

    setStartPoint(currentPage - options.pagesOnSides);
    setEndPoint(currentPage + (options.pageToShow - options.pagesOnSides - 1));
  };

  // * Отслеживаем изменение страницы/количества страниц и обновляем рейндж для генераций номеров страниц
  useEffect(() => {
    generatePoints();
  }, [currentPage, totalPages]);

  const pages = generateRange(startPoint, endPoint);

  return { pages };
};
