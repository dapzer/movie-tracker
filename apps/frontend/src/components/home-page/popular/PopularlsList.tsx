import React, { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import styles from './popular-list.module.scss';
import { UiModal } from '@/components/ui/modal/UiModal';
import Masonry from 'react-masonry-css';
import { CardSkeleton } from '@/lib/loading-skeleton/CardSkeleton';
import { MovieCard } from '@/components/core/movie-card/MovieCard';
import { useGetPopularList } from '@/hooks/useTmdbApi';
import { Typography } from '@/components/ui/typography/UiTypography';

interface PopularlsListProps {
  mediaType: string;
  title: string;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export const PopularlsList = (props: PopularlsListProps) => {
  const { mediaType, title } = props;
  const { lang } = useTranslation();
  const { t } = useTranslation('buttons');
  const { data: popular, isLoading } = useGetPopularList(mediaType, lang);

  return (
    <div>
      <Typography as="h2" variant="title2" className={styles['title']}>
        {title}
      </Typography>

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
              showScore
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
                    showScore
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