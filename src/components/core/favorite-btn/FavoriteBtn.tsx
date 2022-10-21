import React, { FC } from 'react';
import { useFavorite } from '../../../hooks/useFavorite';
import styles from './favorite-btn.module.scss';

interface Props {
  id: number;
  className: string;
  mediaType?: string;
}

const FavoriteBtn: FC<Props> = ({ id, className, mediaType }) => {
  const { isFavorite, handleFavorite } = useFavorite(id, mediaType || '');

  return (
    <div className={styles['favorite-btn']}>
      <button
        onClick={() => handleFavorite()}
        className={`${styles[`${isFavorite ? 'favorite-btn__remove' : 'favorite-btn__add'}`]} ${
          styles[className]
        }`}
      >
        <svg>
          <use href="/icon-favorite.svg#svg"></use>
        </svg>
        {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      </button>
    </div>
  );
};

export default FavoriteBtn;
