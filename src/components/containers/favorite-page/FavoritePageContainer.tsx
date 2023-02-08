import React, { FC } from 'react';
import FavoriteRow from '@/components/favorite-page/favorite-row/FavoriteRow';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '@/types/Enums';
import styles from './favorite-page.module.scss';
import LoginModal from '@/components/core/login-modal/LoginModal';
import { useAppSelector } from '@/redux/hooks';
import { selectFavoriteList } from '@/redux/features/favoriteList/favoriteListSlice';

interface Props {}

const FavoritePageContainer: FC<Props> = () => {
  const { viewed, notViewed, waitNewPart, allFavorites, watchingNow } = useAppSelector(selectFavoriteList);
  const { status } = useSession();
  const { t } = useTranslation('favoritePage');

  return (
    <div className={'container'}>
      {status === LoginStatus.Unauthenticated && (
        <h2 className={styles['unlogin']}>
          <LoginModal btnClass={styles['unlogin_btn']} btnTitle={t('needToAuthTitle')} /> {t('needToAuthDescription')}
        </h2>
      )}
      {!allFavorites?.length && status === LoginStatus.Authenticated && <h2>{t('emptyFavoriteList')}</h2>}
      {!!allFavorites?.length && <h2>{t('page_title')}</h2>}

      {!!watchingNow?.length && <FavoriteRow favoriteList={watchingNow} title={t('statuses.watchingNow')} />}
      {!!notViewed?.length && <FavoriteRow favoriteList={notViewed} title={t('statuses.notViewed')} />}
      {!!waitNewPart?.length && <FavoriteRow favoriteList={waitNewPart} title={t('statuses.waitNewPart')} />}
      {!!viewed?.length && <FavoriteRow favoriteList={viewed} title={t('statuses.viewed')} />}
    </div>
  );
};

export default FavoritePageContainer;
