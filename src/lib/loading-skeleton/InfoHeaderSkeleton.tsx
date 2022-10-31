import React, { FC } from 'react';
import styles from '../../components/ui/imfo-header/imfo-header.module.scss';
import Image from 'next/image';
import FavoriteBtn from '../../components/core/favorite-btn/FavoriteBtn';
import Skeleton from 'react-loading-skeleton';

interface Props {}

const InfoHeaderSkeleton: FC<Props> = () => {
  return (
    <div className={styles['info-header']}>
      <div className={`${styles['info-header__about__title']} ${styles[`info-header__about__title__mobile`]}`}>
        <h2>
          <Skeleton style={{ maxWidth: '250px' }} />
        </h2>
        <h3>
          <Skeleton style={{ maxWidth: '150px' }} />
        </h3>
      </div>

      <div className={styles['info-header__logo']}>
        <div className={styles['info-header__image']}>
          <Skeleton height={405} />
        </div>
        <Skeleton height={45} />
      </div>

      <div className={styles['info-header__about']}>
        <div className={styles['info-header__about__title']}>
          <h2>
            <Skeleton style={{ maxWidth: '250px' }} />
          </h2>
          <h3>
            <Skeleton style={{ maxWidth: '150px' }} />
          </h3>
        </div>

        <ul className={styles['info-header__about__list']}>
          <Skeleton count={6} style={{ maxWidth: '350px' }} />
        </ul>
      </div>
    </div>
  );
};

export default InfoHeaderSkeleton;
