import React, { FC } from 'react';
import styles from '../../components/core/details/details.module.scss';
import CardSkeleton from './CardSkeleton';
import Skeleton from 'react-loading-skeleton';
import InfoHeaderSkeleton from './InfoHeaderSkeleton';

interface Props {}

const DetailsSkeleton: FC<Props> = () => {
  return (
    <div className={styles['details']}>
      <InfoHeaderSkeleton />

      <div className={styles['details__about']}>
        <h2>
          <Skeleton style={{ maxWidth: '250px' }} />
        </h2>

        <p>
          <Skeleton count={3} />
        </p>
      </div>

      <div className={styles['']}>
        <h2>
          <Skeleton style={{ maxWidth: '250px' }} />
        </h2>

        <div className={'details-grid'}>
          {Array(6)
            .fill('_')
            .map((el, index) => (
              <CardSkeleton key={index} horizontal height={225}>
                <ul>
                  <li>
                    <Skeleton style={{ maxWidth: '100px' }} />
                    <Skeleton style={{ maxWidth: '50px' }} />
                  </li>
                </ul>
                <Skeleton style={{ maxWidth: '100px' }} />
              </CardSkeleton>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsSkeleton;
