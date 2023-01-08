import React, { FC } from 'react';
import styles from '../../components/details-page/movie-details/movie-details.module.scss';
import Skeleton from 'react-loading-skeleton';

interface Props {}

const DetailsInfoBlockSkeleton: FC<Props> = () => {
  return (
    <div className={styles['info_block']}>
      <h2>
        <Skeleton style={{ maxWidth: '250px' }} />
      </h2>

      <p>
        <Skeleton count={3} />
      </p>
    </div>
  );
};

export default DetailsInfoBlockSkeleton;
