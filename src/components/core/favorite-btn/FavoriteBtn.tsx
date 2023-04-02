import React, { FC, useState } from 'react';
import { useFavorite } from '@/hooks/useFavorite';
import styles from './favorite-btn.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '@/types/Enums';
import LoginModal from '@/components/core/login-modal/LoginModal';
import { FavoriteIcon, InFavoriteIcon } from '@/components/ui/Icons';

interface Props {
  id: number;
  className: string;
  mediaType: string;
  favoriteListStatus?: string;
}

const FavoriteBtn: FC<Props> = ({ id, className, mediaType, favoriteListStatus }) => {
  const [showLogin, setShowLogin] = useState(false);
  const { handleFavorite, isFavorite } = useFavorite(id);
  const { t } = useTranslation('buttons');
  const { status } = useSession();

  const handleFavoriteStatus = () => {
    if (status === LoginStatus.Unauthenticated) {
      setShowLogin(true);
    } else {
      handleFavorite(id, mediaType);
    }
  };

  return (
    <>
      <button
        onClick={() => handleFavoriteStatus()}
        className={`${styles[`${isFavorite ? 'button_remove' : 'button_add'}`]} ${className} ${styles['button']}`}
      >
        {isFavorite ? (
          <InFavoriteIcon />
        ) : (
          <FavoriteIcon />
        )}
        {isFavorite ? t('delete_from_favorite') : t('add_to_favorite')}
      </button>
      {showLogin && <LoginModal isOpenedDefault={true} customHandler={setShowLogin} />}
    </>
  );
};

export default FavoriteBtn;
