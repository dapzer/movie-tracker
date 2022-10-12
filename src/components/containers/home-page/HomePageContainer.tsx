import React, { FC, useEffect, useState } from 'react';
import Search from '../../home-page/search/Search';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../../../api/searchApi';
import { SearchResponse } from '../../../types/SearchResponse';
import SearchResultsRow from '../../home-page/search-results/SearchResultsRow';

const HomePageContainer: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data } = useQuery<SearchResponse>(
    [
      'searchFilms',
      {
        searchValue: searchTerm,
      },
    ],
    searchApi
  );

  return (
    <div className={`container`}>
      <h2>Добро пожаловать на сайт по отслеживанию кинокартин!</h2>
      <Search setSearchTerm={setSearchTerm} />
      <SearchResultsRow searchResponse={data} />
    </div>
  );
};

export default HomePageContainer;
