import React, { FC, useState } from 'react';
import { useFavorite } from '../../../hooks/useFavorite';
import styles from './favorite-btn.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '../../../types/LoginStatus';
import LoginModal from '../login-modal/LoginModal';
import { StatusesNames } from '../../../types/StatusesNames';

interface Props {
  id: number;
  className: string;
  mediaType?: string;
  favoriteListStatus?: string;
}

const FavoriteBtn: FC<Props> = ({ id, className, mediaType, favoriteListStatus }) => {
  const [showLogin, setShowLogin] = useState(false);
  const { handleFavorite, isFavorite } = useFavorite(id, favoriteListStatus || StatusesNames.notViewed);
  const { t } = useTranslation('buttons');
  const { status } = useSession();

  const handleFavoriteStatus = () => {
    if (status === LoginStatus.Unauthenticated) {
      setShowLogin(true);
    } else {
      handleFavorite(id, mediaType || '');
    }
  };

  return (
    <div className={styles['favorite-btn']}>
      <button
        onClick={() => handleFavoriteStatus()}
        className={`${styles[`${isFavorite ? 'favorite-btn__remove' : 'favorite-btn__add'}`]} ${styles[className]}`}
      >
        <svg>
          <use href="/icon-favorite.svg#svg"></use>
        </svg>
        {isFavorite ? t('delete_from_favorite') : t('add_to_favorite')}
      </button>
      {showLogin && <LoginModal isOpenedDefault={true} customHandler={setShowLogin} />}
    </div>
  );
};

export default FavoriteBtn;
