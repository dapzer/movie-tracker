import React, { FC } from 'react';
import styles from './ui-imfo-header.module.scss';
import Image from 'next/image';
import FavoriteBtn from '@/components/core/favorite-btn/FavoriteBtn';
import useTranslation from 'next-translate/useTranslation';
import { useFavorite } from '@/hooks/useFavorite';
import StatusSelector from '@/components/favorite-page/tracking-menu/status-selector/StatusSelector';
import { StatusesNames } from '@/types/Enums';
import { Typography } from '@/components/ui/typography/UiTypography';

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
  const { getFavoriteItem, isFavorite } = useFavorite(favoriteItem?.id);
  const favoriteItemData = isFavorite ? getFavoriteItem(favoriteItem!.id) : null;

  return (
    <section className={styles['body']}>
      <div className={`${styles['title_block']} ${styles[`title_block_mobile`]}`}>
        <Typography as="h2" variant="title2">
          {title} {favoriteItem?.media_type && `(${t(`card:${favoriteItem?.media_type}`)})`}
        </Typography>
        <Typography as="h3" variant="title3" hidden={!isHaveOriginalName}>
          {original_title}
        </Typography>
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
        {favoriteItem && (
          <StatusSelector
            mediaType={favoriteItem.media_type}
            id={favoriteItem.id}
            dropdownStyles={styles['status_selector']}
            currentStatus={favoriteItemData?.trackingData.currentStatus || StatusesNames.notViewed}
            trigger={<FavoriteBtn id={favoriteItem.id} className={styles['favorite_btn']} mediaType={favoriteItem.media_type} asListTrigger />}
          />
        )}
      </div>

      <div className={styles['info_block']}>
        <div className={styles['title_block']}>
          <Typography as="h2" variant="title2">
            {title} {favoriteItem?.media_type && `(${t(`card:${favoriteItem?.media_type}`)})`}
          </Typography>
          <Typography as="h3" variant="title3" hidden={!isHaveOriginalName}>
            {original_title}
          </Typography>
        </div>

        <ul className={styles['list']}>{children}</ul>
      </div>
    </section>
  );
};

export default UiInfoHeader;
