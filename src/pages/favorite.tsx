import React, { FC } from 'react';
import FavoritePageContainer from '@/components/containers/favorite-page/FavoritePageContainer';
import useTranslation from 'next-translate/useTranslation';
import { NextSeo } from 'next-seo';

const Favorite: FC = () => {
  const { t } = useTranslation('pagesSeo');

  return (
    <div>
      <NextSeo title={t('favoritePage.title')} />

      <FavoritePageContainer />
    </div>
  );
};

export default Favorite;
