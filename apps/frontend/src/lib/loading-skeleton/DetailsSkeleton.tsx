import styles from '@/components/details-page/movie-details/movie-details.module.scss';
import { InfoHeaderSkeleton } from './InfoHeaderSkeleton';
import { DetailsCastSkeleton } from './DetailsCastSkeleton';
import { DetailsInfoBlockSkeleton } from './DetailsInfoBlockSkeleton';

export const DetailsSkeleton = () => {
  return (
    <div className={styles['container']}>
      <InfoHeaderSkeleton />

      <DetailsInfoBlockSkeleton />

      <DetailsCastSkeleton />
    </div>
  );
};
