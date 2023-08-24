import React, { FC } from 'react';
import styles from '@/components/ui/imfo-header/ui-imfo-header.module.scss';
import Skeleton from 'react-loading-skeleton';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {}

const InfoHeaderSkeleton: FC<Props> = () => {
  return (
    <section className={styles['body']}>
      <div className={`${styles['title_block']} ${styles[`title_block_mobile`]}`}>
        <Typography as="h2" variant="title2">
          <Skeleton style={{ maxWidth: '250px' }} />
        </Typography>
        <Typography as="h3" variant="title3">
          <Skeleton style={{ maxWidth: '150px' }} />
        </Typography>
      </div>

      <div className={styles['logo']}>
        <div className={styles['image']}>
          <Skeleton height={405} />
        </div>
        <Skeleton height={45} />
      </div>

      <div className={styles['info_block']}>
        <div className={styles['title_block']}>
          <Typography>
            <Skeleton style={{ maxWidth: '250px' }} />
          </Typography>
          <Typography as="h3" variant="title3">
            <Skeleton style={{ maxWidth: '150px' }} />
          </Typography>
        </div>

        <ul className={styles['list']}>
          <Skeleton count={6} style={{ maxWidth: '350px' }} />
        </ul>
      </div>
    </section>
  );
};

export default InfoHeaderSkeleton;
