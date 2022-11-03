import React, { FC } from 'react';
import styles from './imfo-header.module.scss';
import Image from 'next/image';
import FavoriteBtn from '../../core/favorite-btn/FavoriteBtn';

interface Props {
  image?: string;
  children: React.ReactNode;
  original_title: string;
  title: string;
  favoriteData?: {
    id: number;
    media_type?: string;
  };
}

const UiInfoHeader: FC<Props> = ({ children, title, original_title, image, favoriteData }) => {
  const isHaveOriginalName = original_title !== title;

  return (
    <div className={styles['info-header']}>
      <div className={`${styles['info-header__about__title']} ${styles[`info-header__about__title__mobile`]}`}>
        <h2>{title}</h2>
        <h3 hidden={!isHaveOriginalName}>{original_title}</h3>
      </div>

      <div className={styles['info-header__logo']}>
        <div className={styles['info-header__image']}>
          <Image
            src={image ? `/api/proxy/image?imageUrl=https://image.tmdb.org/t/p/original${image}` : '/defaultPoster.svg'}
            width="100"
            height="150"
            objectFit="contain"
            sizes="320"
            alt="Brand logo"
          />
        </div>
        {favoriteData && <FavoriteBtn id={favoriteData.id} className={'favorite-btn__details'} mediaType={favoriteData.media_type} />}
      </div>

      <div className={styles['info-header__about']}>
        <div className={styles['info-header__about__title']}>
          <h2>{title}</h2>
          <h3 hidden={!isHaveOriginalName}>{original_title}</h3>
        </div>

        <ul className={styles['info-header__about__list']}>{children}</ul>
      </div>
    </div>
  );
};

export default UiInfoHeader;
