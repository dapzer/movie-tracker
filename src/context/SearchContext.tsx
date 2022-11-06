import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface SearchContext {
  searchTerm: string;
  currentPage: number;
  setSearchTerm: (value: string) => void;
  setCurrentPage: (value: number) => void;
  changeSearch: (value: string) => void;
  changePage: (value: number) => void;
  updateRouter: (str: string, page: number) => void;
  clearQueries: () => void;
}

const SearchContext = createContext<SearchContext>(null!);

export const useSearchContext = () => {
  return useContext(SearchContext);
};

interface Props {
  children: React.ReactNode;
}

export const SearchContextProvider: FC<Props> = ({ children }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(5);

  useEffect(() => {
    if (router.query.search) {
      setSearchTerm(router.query.search?.toString());
    }
    if (router.query.page) {
      setCurrentPage(Number(router.query.page));
    }
  }, [router.isReady]);

  const updateRouter = (str: string, page: number) => {
    router.push({
      pathname: router.pathname,
      query: { search: str, page: page },
    });
  };

  const changeSearch = (str: string) => {
    setSearchTerm(str);
    updateRouter(str, 1);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
    updateRouter(searchTerm, page);
  };

  const clearQueries = () => {
    router.push({ pathname: router.pathname });
    setSearchTerm('');
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        changeSearch,
        changePage,
        updateRouter,
        clearQueries,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
