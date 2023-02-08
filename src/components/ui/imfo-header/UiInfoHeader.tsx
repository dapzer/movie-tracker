import React, { FC } from 'react';
import styles from './ui-imfo-header.module.scss';
import Image from 'next/image';
import FavoriteBtn from '@/components/core/favorite-btn/FavoriteBtn';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  image?: string;
  children: React.ReactNode;
  original_title: string;
  title: string;
  favoriteItem?: {
    id: number;
    media_type: string;
  };
}

const UiInfoHeader: FC<Props> = ({ children, title, original_title, image, favoriteItem }) => {
  const isHaveOriginalName = original_title !== title;
  const { t, lang } = useTranslation();

  return (
    <section className={styles['body']}>
      <div className={`${styles['title_block']} ${styles[`title_block_mobile`]}`}>
        <h2>
          {title} {favoriteItem?.media_type && `(${t(`card:${favoriteItem?.media_type}`)})`}
        </h2>
        <h3 hidden={!isHaveOriginalName}>{original_title}</h3>
      </div>

      <div className={styles['logo']}>
        <div className={styles['image']}>
          <Image
            src={image ? `/api/proxy/image?imageUrl=https://image.tmdb.org/t/p/original${image}` : '/defaultPoster.svg'}
            width={270}
            height={405}
            sizes="33wv"
            alt="Img"
          />
        </div>
        {favoriteItem && <FavoriteBtn id={favoriteItem.id} className={styles['favorite_btn']} mediaType={favoriteItem.media_type} />}
      </div>

      <div className={styles['info_block']}>
        <div className={styles['title_block']}>
          <h2>
            {title} {favoriteItem?.media_type && `(${t(`card:${favoriteItem?.media_type}`)})`}
          </h2>
          <h3 hidden={!isHaveOriginalName}>{original_title}</h3>
        </div>

        <ul className={styles['list']}>{children}</ul>
      </div>
    </section>
  );
};

export default UiInfoHeader;
