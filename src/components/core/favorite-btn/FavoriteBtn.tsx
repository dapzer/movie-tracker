import React, { FC, useState } from 'react';
import { useFavorite } from '@/hooks/useFavorite';
import styles from './favorite-btn.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '@/types/Enums';
import LoginModal from '@/components/core/login-modal/LoginModal';
import { FavoriteIcon, InFavoriteIcon, ListIcon } from '@/components/ui/Icons';

interface Props {
  id: number;
  className: string;
  mediaType: string;
  asListTrigger?: boolean;
}

const FavoriteBtn: FC<Props> = ({ id, className, mediaType, asListTrigger }) => {
  const [showLogin, setShowLogin] = useState(false);
  const { handleFavorite, isFavorite } = useFavorite(id);
  const { t } = useTranslation();
  const { status } = useSession();

  const handleFavoriteStatus = () => {
    if (status === LoginStatus.Unauthenticated) {
      setShowLogin(true);
    } else {
      if (isFavorite && asListTrigger) return;
      handleFavorite(id, mediaType);
    }
  };

  return (
    <>
      <button
        onClick={() => handleFavoriteStatus()}
        className={`${styles[`${isFavorite ? 'button_remove' : 'button_add'}`]} ${asListTrigger && isFavorite ? styles['button_without_hover'] : ''} ${className} ${styles['button']}`}
      >
        {!isFavorite && (
          <>
            <FavoriteIcon />
            {t('buttons:add_to_favorite')}
          </>
        )}

        {isFavorite && !asListTrigger && (
          <>
            <InFavoriteIcon />
            {t('buttons:delete_from_favorite')}
          </>
        )}

        {isFavorite && asListTrigger && (
          <>
            <ListIcon />
            {t('favoritePage:changeStatus')}
          </>
        )}
      </button>
      {showLogin && <LoginModal isOpenedDefault={true} customHandler={setShowLogin} />}
    </>
  );
};

export default FavoriteBtn;
