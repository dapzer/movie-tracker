import React, { FC, useRef } from 'react';
import { Search } from '@/components/home-page/search/Search';
import { SearchResultsRow } from '@/components/home-page/search-results/SearchResultsRow';
import { HomePageInfo } from '@/components/home-page/home-page-info/HomePageInfo';

export const HomePageContainer: FC = () => {
  const searchTitleRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={'container'}>
      <HomePageInfo />
      <Search searchTitleRef={searchTitleRef} />
      <SearchResultsRow searchTitleRef={searchTitleRef} />
    </div>
  );
};
