import React, { FC, useEffect, useState } from 'react';
import Search from '../../home-page/search/Search';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../../../api/searchApi';
import { SearchResponse } from '../../../types/SearchResponse';
import SearchResultsRow from '../../home-page/search-results/SearchResultsRow';
import Pagination from '../../home-page/pagination/Pagination';

const HomePageContainer: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useQuery<SearchResponse>(
    [
      'searchFilms',
      {
        searchValue: searchTerm,
        page: currentPage,
      },
    ],
    searchApi
  );

  return (
    <div className={`container`}>
      <h2>Добро пожаловать на сайт по отслеживанию кинокартин!</h2>
      <Search setSearchTerm={setSearchTerm} handlePage={setCurrentPage} />
      <SearchResultsRow searchResponse={data} />

      {data?.total_pages && (
        <Pagination
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
