import React, { FC } from 'react';
import FavoriteRow from '../../favorite-page/favorite-row/FavoriteRow';
import useTranslation from 'next-translate/useTranslation';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '../../../types/Enums';
import styles from './favorite-page.module.scss';
import LoginModal from '../../core/login-modal/LoginModal';
import { useAppSelector } from '../../../redux/hooks';
import { selectFavoriteList } from '../../../redux/features/favoriteList/favoriteListSlice';

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
      {allFavorites?.length < 1 && status === LoginStatus.Authenticated && <h2>{t('emptyFavoriteList')}</h2>}
      {allFavorites?.length >= 1 && <h2>{t('page_title')}</h2>}

      {watchingNow?.length > 0 && <FavoriteRow favoriteList={watchingNow} title={t('statuses.watchingNow')} />}
      {notViewed?.length > 0 && <FavoriteRow favoriteList={notViewed} title={t('statuses.notViewed')} />}
      {waitNewPart?.length > 0 && <FavoriteRow favoriteList={waitNewPart} title={t('statuses.waitNewPart')} />}
      {viewed?.length > 0 && <FavoriteRow favoriteList={viewed} title={t('statuses.viewed')} />}
    </div>
  );
};

export default FavoritePageContainer;
