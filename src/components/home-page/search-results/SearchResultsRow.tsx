import React, { FC, useEffect } from 'react';
import { SearchResponse } from '../../../types/SearchResponse';
import SearchResultMovie from './SearchResultMovie';
import styles from './search-results.module.scss';
import Masonry from 'react-masonry-css';
import { ContentNames } from '../../../types/ContentNames';
import SearchResultPerson from './SearchResultPerson';
import useTranslation from 'next-translate/useTranslation';
import CardSkeleton from '../../../lib/loading-skeleton/CardSkeleton';
import Skeleton from 'react-loading-skeleton';
import UiPagination from '../../ui/pagination/UiPagination';
import { useSearchContext } from '../../../context/SearchContext';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../../../api/fetchApi';

interface Props {}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const SearchResultsRow: FC<Props> = () => {
  const { t, lang } = useTranslation('searchPage');
  const { currentPage, changePage, searchTerm, scrollToSearch } = useSearchContext();

  const {
    data: searchResponse,
    isLoading,
    isSuccess,
  } = useQuery<SearchResponse.RootObject>(
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

  useEffect(() => {
    if (isSuccess) {
      scrollToSearch();
    }
  }, [searchResponse]);

  return (
    <div className={styles['result']}>
      {searchResponse && (
        <h3>
          {t('search_totalResults')} {searchResponse?.total_results}
        </h3>
      )}

      <div className={styles['result__items']}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="searching-results-masonry__row"
          columnClassName="searching-results-masonry__row-column"
        >
          {isLoading &&
            Array(20)
              .fill('_')
              .map((el, i) => (
                <CardSkeleton key={i}>
                  <Skeleton width={50} height={'1em'} />
                </CardSkeleton>
              ))}
          {searchResponse &&
            searchResponse.results.map((item, index) =>
              item.media_type === ContentNames.Person ? (
                <SearchResultPerson key={item.id} personData={item} />
              ) : (
                <SearchResultMovie key={item.id} item={item} />
              )
            )}
        </Masonry>

        {searchResponse && searchResponse?.total_pages > 1 && (
          <UiPagination
            paginationInfo={{
              currentPage,
              handlePage: changePage,
              totalPages: searchResponse?.total_pages,
              options: {
                pageToShow: 5,
                pagesOnSides: 2,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchResultsRow;
