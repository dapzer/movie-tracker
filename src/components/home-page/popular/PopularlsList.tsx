import React, { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trendsApi } from '../../../api/fetchApi';
import useTranslation from 'next-translate/useTranslation';
import styles from './popular-list.module.scss';
import UiModal from '../../ui/modal/UiModal';
import Masonry from 'react-masonry-css';
import CardSkeleton from '../../../lib/loading-skeleton/CardSkeleton';
import MovieCard from '../../core/movie-card/MovieCard';
import { SearchResponse } from '../../../types/SearchResponse';

interface Props {
  mediaType: string;
  title: string;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const PopularlsList: FC<Props> = ({ mediaType, title }) => {
  const { lang } = useTranslation();
  const { t } = useTranslation('buttons');

  const { data: popular, isLoading } = useQuery<SearchResponse.RootObject>({
    queryKey: [
      'getDetails',
      {
        mediaType: mediaType,
        language: lang,
      },
    ],
    queryFn: trendsApi,
  });

  return (
    <div>
      <h2 className={styles['title']}>{title}</h2>

      {isLoading && (
        <div className={styles['row']}>
          {Array(6)
            .fill('_')
            .map((_, index) => (
              <CardSkeleton key={`popular-item-skeleton-${index}`} height={240} small />
            ))}
        </div>
      )}

      {popular && (
        <div className={styles['row']}>
          {popular.results.slice(0, 5).map((item, index) => (
            <MovieCard
              key={`popular-item-${index}`}
              mediaType={mediaType}
              mediaId={item.id}
              score={item.vote_average}
              title={item.title || item.name}
              image={item.poster_path}
              releaseDate={item.release_date || item.first_air_date}
              small
            />
          ))}

          <UiModal title={title} btnTitle={t('full_list')} btnClass={`detail-full-cast-btn ${styles['full_list']}`}>
            <div className={styles['modal_list']}>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="searching-results-masonry__row"
                columnClassName="searching-results-masonry__row-column"
              >
                {popular.results.map((item) => (
                  <MovieCard
                    key={`popular-item-${item.id}`}
                    mediaType={mediaType}
                    mediaId={item.id}
                    score={item.vote_average}
                    title={item.title || item.name}
                    image={item.poster_path}
                    releaseDate={item.release_date || item.first_air_date}
                    favoriteBtn
                  />
                ))}
              </Masonry>
            </div>
          </UiModal>
        </div>
      )}
    </div>
  );
};

export default PopularlsList;
