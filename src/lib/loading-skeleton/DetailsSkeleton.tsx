import React, { FC } from 'react';
import styles from '../../components/core/details/movie-details/movie-details.module.scss';
import CardSkeleton from './CardSkeleton';
import Skeleton from 'react-loading-skeleton';
import InfoHeaderSkeleton from './InfoHeaderSkeleton';
import DetailsCastSkeleton from './DetailsCastSkeleton';
import DetailsInfoBlockSkeleton from './DetailsInfoBlockSkeleton';

interface Props {}

const DetailsSkeleton: FC<Props> = () => {
  return (
    <div className={styles['container']}>
      <InfoHeaderSkeleton />

      <DetailsInfoBlockSkeleton />

      <DetailsCastSkeleton />
    </div>
  );
};

export default DetailsSkeleton;
