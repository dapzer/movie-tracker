import React, { FC, RefObject, useEffect } from 'react';
import styles from './search-results.module.scss';
import Masonry from 'react-masonry-css';
import { ContentNames } from '../../../types/ContentNames';
import SearchResultPerson from './SearchResultPerson';
import useTranslation from 'next-translate/useTranslation';
import CardSkeleton from '../../../lib/loading-skeleton/CardSkeleton';
import Skeleton from 'react-loading-skeleton';
import UiPagination from '../../ui/pagination/UiPagination';
import PopularlsList from '../popular/PopularlsList';
import MovieCard from '../../core/movie-card/MovieCard';
import { isOnlySpaces } from '../../../utils/isOnlySpaces.helper';
import { useAppSelector } from '../../../redux/hooks';
import { selectSearchParams } from '../../../redux/features/searchParams/searchParamsSlice';
import { useSearch } from '../../../hooks/useSearch';
import { useGetSearchByTerm } from '../../../hooks/useTmdbApi';

interface Props {
  searchTitleRef: RefObject<HTMLInputElement> | null;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const SearchResultsRow: FC<Props> = ({ searchTitleRef }) => {
  const { t, lang } = useTranslation('searchPage');
  const { changePage, scrollToSearch } = useSearch();
  const { currentPage, searchTerm } = useAppSelector(selectSearchParams);

  const {
    data: searchResponse,
    isLoading,
    isSuccess,
  } = useGetSearchByTerm(searchTerm, lang, currentPage);

  useEffect(() => {
    if (isSuccess && searchResponse?.results?.length && searchTitleRef) {
      scrollToSearch(searchTitleRef);
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
          className='searching-results-masonry__row'
          columnClassName='searching-results-masonry__row-column'
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
                  key={`movie-card-${item.id}`}
                  mediaType={item.media_type}
                  mediaId={item.id}
                  score={item.vote_average}
                  title={item.title || item.name}
                  image={item.poster_path}
                  releaseDate={item.release_date || item.first_air_date}
                  showScore
                  favoriteBtn
                />
              ),
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
