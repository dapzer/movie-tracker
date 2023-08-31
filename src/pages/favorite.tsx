import { FavoritePageContainer } from '@/components/containers/favorite-page/FavoritePageContainer';
import useTranslation from 'next-translate/useTranslation';
import { NextSeo } from 'next-seo';

const Favorite = () => {
  const { t } = useTranslation('pagesSeo');

  return (
    <>
      <NextSeo title={t('favoritePage.title')} />

      <FavoritePageContainer />
    </>
  );
};

export default Favorite;
