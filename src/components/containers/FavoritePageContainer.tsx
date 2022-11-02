import React, { FC } from 'react';
import FavoriteRow from '../favorite-page/favorite-row/FavoriteRow';
import useTranslation from 'next-translate/useTranslation';
import { useFavoriteContext } from '../../context/FavoriteContext';
import { useSession } from 'next-auth/react';
import { LoginStatus } from '../../types/LoginStatus';

interface Props {}

const FavoritePageContainer: FC<Props> = () => {
  const { favoriteList } = useFavoriteContext();
  const { status } = useSession();
  const { t } = useTranslation('favoritePage');

  return (
    <div className={'container'}>
      {status === LoginStatus.Unauthenticated && <h2>{t('needToAuth')}</h2>}
      {((!favoriteList.allFavorites && status === LoginStatus.Authenticated) || favoriteList.allFavorites?.length < 1) && (
        <h2>{t('emptyFavoriteList')}</h2>
      )}
      {favoriteList.allFavorites?.length >= 1 && <h2>{t('page_title')}</h2>}

      {favoriteList?.watchingNow?.length > 0 && <FavoriteRow favoriteList={favoriteList.watchingNow} title={t('statuses.watchingNow')} />}
      {favoriteList?.notViewed?.length > 0 && <FavoriteRow favoriteList={favoriteList.notViewed} title={t('statuses.notViewed')} />}
      {favoriteList?.waitNewPart?.length > 0 && <FavoriteRow favoriteList={favoriteList.waitNewPart} title={t('statuses.waitNewPart')} />}
      {favoriteList?.viewed?.length > 0 && <FavoriteRow favoriteList={favoriteList.viewed} title={t('statuses.viewed')} />}
    </div>
  );
};

export default FavoritePageContainer;
