import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import HomePageContainer from '@/components/containers/HomePageContainer';

const Home: NextPage = () => {
  return (
    <>
      <NextSeo  />

      <HomePageContainer />
    </>
  );
};

export default Home;
