import React, { FC } from 'react';
import { useFavorite } from '../../../hooks/useFavorite';
import styles from './favorite-btn.module.scss';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  id: number;
  className: string;
  mediaType?: string;
}

const FavoriteBtn: FC<Props> = ({ id, className, mediaType }) => {
  const { isFavorite, handleFavorite } = useFavorite(id, mediaType || '');
  const { t } = useTranslation('buttons');

  return (
    <div className={styles['favorite-btn']}>
      <button onClick={() => handleFavorite()} className={`${styles[`${isFavorite ? 'favorite-btn__remove' : 'favorite-btn__add'}`]} ${styles[className]}`}>
        <svg>
          <use href="/icon-favorite.svg#svg"></use>
        </svg>
        {isFavorite ? t('delete_from_favorite') : t('add_to_favorite')}
      </button>
    </div>
  );
};

export default FavoriteBtn;
