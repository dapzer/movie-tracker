import styles from '@/components/details-page/movie-details/movie-details.module.scss';
import Skeleton from 'react-loading-skeleton';
import { Typography } from '@/components/ui/typography/UiTypography';

export const DetailsInfoBlockSkeleton = () => {
  return (
    <section className={styles['info_block']}>
      <Typography as="h2" variant="title2">
        <Skeleton style={{ maxWidth: '250px' }} />
      </Typography>

      <Typography>
        <Skeleton count={3} />
      </Typography>
    </section>
  );
};