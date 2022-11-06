import React, { FC } from 'react';
import Search from '../home-page/search/Search';
import SearchResultsRow from '../home-page/search-results/SearchResultsRow';
import HomePageInfo from '../home-page/home-page-info/HomePageInfo';

const HomePageContainer: FC = () => {
  return (
    <div className={`container`}>
      <HomePageInfo />
      <Search />
      <SearchResultsRow />
    </div>
  );
};

export default HomePageContainer;
