import { RefObject, useEffect } from 'react';
import { useRouter } from 'next/router';
import { changeCurrentPage, changeSearchTern, selectSearchParams } from '@/redux/features/searchParams/searchParamsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, currentPage } = useAppSelector(selectSearchParams);
  const router = useRouter();

  useEffect(() => {
    if (router.query.search) {
      dispatch(changeSearchTern(router.query.search?.toString()));
    }
    if (router.query.page) {
      dispatch(changeCurrentPage(Number(router.query.page)));
    }
  }, [router.isReady]);

  const updateRouter = (str: string, page: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { search: str, page: page },
      },
      undefined,
      { scroll: false }
    );
  };

  const changeSearch = (str: string) => {
    dispatch(changeSearchTern(str));
    dispatch(changeCurrentPage(1));
    updateRouter(str, 1);
  };

  const changePage = (page: number) => {
    dispatch(changeCurrentPage(page));
    updateRouter(searchTerm, page);
  };

  const clearQueries = () => {
    router.push({ pathname: router.pathname }, undefined, { scroll: false });
    dispatch(changeSearchTern(''));
    dispatch(changeCurrentPage(1));
  };

  const scrollToSearch = (ref: RefObject<HTMLInputElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    changeSearch,
    changePage,
    updateRouter,
    clearQueries,
    scrollToSearch,
  };
};
