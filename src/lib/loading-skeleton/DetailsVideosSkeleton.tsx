import React, { FC } from 'react';
import styles from '../../components/details-page/movie-details/movie-details.module.scss';
import Skeleton from 'react-loading-skeleton';
import CardSkeleton from './CardSkeleton';

interface Props {}

const DetailsVideosSkeleton: FC<Props> = () => {
  return (
    <div className={styles['']}>
      <h2>
        <Skeleton style={{ maxWidth: '250px' }} />
      </h2>

      <div className={styles["videos_grid"]}>
        {Array(4)
          .fill('_')
          .map((el, index) => (
            <CardSkeleton key={index} height={150} />
          ))}
      </div>
    </div>
  );
};

export default DetailsVideosSkeleton;
