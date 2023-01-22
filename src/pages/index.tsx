import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import HomePageContainer from '@/components/containers/HomePageContainer';
import useTranslation from 'next-translate/useTranslation';

const Home: NextPage = () => {
  const { t } = useTranslation('pagesSeo');
  return (
    <>
      <NextSeo title={t('homePage.title')} />

      <HomePageContainer />
    </>
  );
};

export default Home;
