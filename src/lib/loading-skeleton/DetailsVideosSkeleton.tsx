import React, { FC } from 'react';
import styles from '@/components/details-page/movie-details/movie-details.module.scss';
import Skeleton from 'react-loading-skeleton';
import { CardSkeleton } from './CardSkeleton';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {}

export const DetailsVideosSkeleton: FC<Props> = () => {
  return (
    <section className={styles['']}>
      <Typography as="h2" variant="title2">
        <Skeleton style={{ maxWidth: '250px' }} />
      </Typography>

      <div className={styles['videos_grid']}>
        {Array(4)
          .fill('_')
          .map((el, index) => (
            <CardSkeleton key={index} height={150} />
          ))}
      </div>
    </section>
  );
};
