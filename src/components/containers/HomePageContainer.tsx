import React, { FC, useRef } from 'react';
import Search from '../home-page/search/Search';
import SearchResultsRow from '../home-page/search-results/SearchResultsRow';
import HomePageInfo from '../home-page/home-page-info/HomePageInfo';

const HomePageContainer: FC = () => {
  const searchTitleRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className={`container`}>
      <HomePageInfo />
      <Search searchTitleRef={searchTitleRef} />
      <SearchResultsRow searchTitleRef={searchTitleRef} />
    </div>
  );
};

export default HomePageContainer;
