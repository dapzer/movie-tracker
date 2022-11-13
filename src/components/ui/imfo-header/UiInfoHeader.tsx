import React, { FC } from 'react';
import styles from './ui-imfo-header.module.scss';
import Image from 'next/image';
import FavoriteBtn from '../../core/favorite-btn/FavoriteBtn';
import useTranslation from 'next-translate/useTranslation';

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
  const { t, lang } = useTranslation();

  return (
    <div className={styles['body']}>
      <div className={`${styles['title_block']} ${styles[`title_block_mobile`]}`}>
        <h2>
          {title} {favoriteData?.media_type && `(${t(`card:${favoriteData?.media_type}`)})`}
        </h2>
        <h3 hidden={!isHaveOriginalName}>{original_title}</h3>
      </div>

      <div className={styles['logo']}>
        <div className={styles['image']}>
          <Image
            src={image ? `/api/proxy/image?imageUrl=https://image.tmdb.org/t/p/original${image}` : '/defaultPoster.svg'}
            blurDataURL={image ? `/api/proxy/image?imageUrl=https://image.tmdb.org/t/p/original${image}` : '/defaultPoster.svg'}
            placeholder="blur"
            width={100}
            height={150}
            objectFit="contain"
            sizes="33wv"
            alt="Img"
          />
        </div>
        {favoriteData && <FavoriteBtn id={favoriteData.id} className={styles['favorite_btn']} mediaType={favoriteData.media_type} />}
      </div>

      <div className={styles['info_block']}>
        <div className={styles['title_block']}>
          <h2>
            {title} {favoriteData?.media_type && `(${t(`card:${favoriteData?.media_type}`)})`}
          </h2>
          <h3 hidden={!isHaveOriginalName}>{original_title}</h3>
        </div>

        <ul className={styles['list']}>{children}</ul>
      </div>
    </div>
  );
};

export default UiInfoHeader;
