import { useState } from 'react';
import { useFavorite } from '@/hooks/useFavorite';
import styles from './favorite-btn.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '@/types/Enums';
import { LoginModal } from '@/components/core/login-modal/LoginModal';
import { FavoriteIcon, InFavoriteIcon, ListIcon } from '@/components/ui/Icons';
import clsx from 'clsx';
import { UiLoader } from '@/components/ui/loader/UiLoader';

interface FavoriteBtnProps {
  id: number;
  className: string;
  mediaType: string;
  asListTrigger?: boolean;
}

export const FavoriteBtn = (props: FavoriteBtnProps) => {
  const { id, className, mediaType, asListTrigger } = props;
  const [showLogin, setShowLogin] = useState(false);
  const { handleFavorite, isFavorite, isLoading } = useFavorite(id);
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
        className={clsx(styles['button'], {
          [styles['button_remove']]: isFavorite,
          [styles['button_add']]: !isFavorite,
          [styles['button_without_hover']]: asListTrigger && isFavorite,
          [styles['button_loading']]: isLoading,
          [className]: className,
        })}
      >
        {!isFavorite && (
          <>
            {isLoading && <UiLoader />}
            {!isLoading && <FavoriteIcon />}
            {t('buttons:add_to_favorite')}
          </>
        )}

        {isFavorite && !asListTrigger && (
          <>
            {isLoading && <UiLoader />}
            {!isLoading && <InFavoriteIcon />}
            {t('buttons:delete_from_favorite')}
          </>
        )}

        {isFavorite && asListTrigger && (
          <>
            {isLoading && <UiLoader />}
            {!isLoading && <ListIcon />}
            {t('favoritePage:changeStatus')}
          </>
        )}
      </button>
      {showLogin && <LoginModal isOpenedDefault customHandler={setShowLogin} />}
    </>
  );
};
