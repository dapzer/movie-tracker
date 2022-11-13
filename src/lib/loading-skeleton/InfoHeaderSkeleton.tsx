import React, { FC } from 'react';
import styles from '../../components/ui/imfo-header/ui-imfo-header.module.scss';
import Skeleton from 'react-loading-skeleton';

interface Props {}

const InfoHeaderSkeleton: FC<Props> = () => {
  return (
    <div className={styles['body']}>
      <div className={`${styles['title_block']} ${styles[`title_block_mobile`]}`}>
        <h2>
          <Skeleton style={{ maxWidth: '250px' }} />
        </h2>
        <h3>
          <Skeleton style={{ maxWidth: '150px' }} />
        </h3>
      </div>

      <div className={styles['logo']}>
        <div className={styles['image']}>
          <Skeleton height={405} />
        </div>
        <Skeleton height={45} />
      </div>

      <div className={styles['info_block']}>
        <div className={styles['title_block']}>
          <h2>
            <Skeleton style={{ maxWidth: '250px' }} />
          </h2>
          <h3>
            <Skeleton style={{ maxWidth: '150px' }} />
          </h3>
        </div>

        <ul className={styles['list']}>
          <Skeleton count={6} style={{ maxWidth: '350px' }} />
        </ul>
      </div>
    </div>
  );
};

export default InfoHeaderSkeleton;
