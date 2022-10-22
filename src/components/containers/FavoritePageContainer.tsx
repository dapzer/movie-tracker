import React, { FC } from 'react';
import FavoriteRow from '../favorite-page/favorite-row/FavoriteRow';
import useTranslation from 'next-translate/useTranslation';

interface Props {}

const FavoritePageContainer: FC<Props> = () => {
  const { t } = useTranslation('favoritePage');

  return (
    <div className={'container'}>
      <h2>{t('page_title')}</h2>
      <FavoriteRow />
    </div>
  );
};

export default FavoritePageContainer;
