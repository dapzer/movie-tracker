import React, { FC, useState } from 'react';
import Search from '../home-page/search/Search';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../../api/fetchApi';
import { SearchResponse } from '../../types/SearchResponse';
import SearchResultsRow from '../home-page/search-results/SearchResultsRow';
import UiPagination from '../ui/pagination/UiPagination';
import useTranslation from 'next-translate/useTranslation';

const HomePageContainer: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { t, lang } = useTranslation('searchPage');

  const { data } = useQuery<SearchResponse.RootObject>(
    [
      'searchFilms',
      {
        searchValue: searchTerm,
        page: currentPage,
        language: lang,
      },
    ],
    searchApi
  );

  return (
    <div className={`container`}>
      <h2>{t('page_title')}</h2>
      <Search setSearchTerm={setSearchTerm} handlePage={setCurrentPage} />
      <SearchResultsRow searchResponse={data} />

      {data?.total_pages && data?.total_pages > 1 && (
        <UiPagination
          paginationInfo={{
            currentPage,
            handlePage: setCurrentPage,
            totalPages: data?.total_pages,
            options: {
              pageToShow: 5,
              pagesOnSides: 2,
            },
          }}
        />
      )}
    </div>
  );
};

export default HomePageContainer;
