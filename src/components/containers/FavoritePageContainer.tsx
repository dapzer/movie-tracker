import React, { FC } from 'react';
import FavoriteRow from '../favorite-page/favorite-row/FavoriteRow';
import useTranslation from 'next-translate/useTranslation';
import { useFavoriteContext } from '../../context/FavoriteContext';
import { StatusesNames } from '../../types/StatusesNames';

interface Props {}

const FavoritePageContainer: FC<Props> = () => {
  const { t } = useTranslation('favoritePage');
  const { favoriteList } = useFavoriteContext();

  return (
    <div className={'container'}>
      <h2>{t('page_title')}</h2>
      {favoriteList?.notViewed?.length > 0 && (
        <FavoriteRow favoriteListStatus={StatusesNames.notViewed} favoriteList={favoriteList.notViewed} title={t('statuses.notViewed')} />
      )}
      {favoriteList?.watchingNow?.length > 0 && (
        <FavoriteRow favoriteListStatus={StatusesNames.WatchingNow} favoriteList={favoriteList.watchingNow} title={t('statuses.watchingNow')} />
      )}
      {favoriteList?.waitNewPart?.length > 0 && (
        <FavoriteRow favoriteListStatus={StatusesNames.waitNewPart} favoriteList={favoriteList.waitNewPart} title={t('statuses.waitNewPart')} />
      )}
      {favoriteList?.viewed?.length > 0 && (
        <FavoriteRow favoriteListStatus={StatusesNames.Viewed} favoriteList={favoriteList.viewed} title={t('statuses.viewed')} />
      )}
    </div>
  );
};

export default FavoritePageContainer;
