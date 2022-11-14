import React, { FC, useEffect } from 'react';
import { SearchResponse } from '../../../types/SearchResponse';
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
import PopularlsList from '../popular/PopularlsList';
import MovieCard from '../../core/movie-card/MovieCard';
import { isOnlySpaces } from '../../../utils/isOnlySpaces.helper';

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
    if (isSuccess && searchResponse?.results?.length) {
      scrollToSearch();
    }
  }, [searchResponse]);

  return (
    <div className={styles['content']}>
      {isOnlySpaces(searchTerm) && (
        <>
          <PopularlsList title={t('popular_movies')} mediaType={ContentNames.Movie} />
          <PopularlsList title={t('popular_tv')} mediaType={ContentNames.Series} />
        </>
      )}

      {searchResponse && (
        <h3>{searchResponse.results.length > 0 ? `${t('search_totalResults')} ${searchResponse?.total_results}` : t('search_notFound')}</h3>
      )}

      <div className={styles['items']}>
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
                <MovieCard
                  mediaType={item.media_type}
                  mediaId={item.id}
                  score={item.vote_average}
                  title={item.title || item.name}
                  image={item.poster_path}
                  releaseDate={item.release_date || item.first_air_date}
                  favoriteBtn
                />
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
