import type { NextPage } from 'next';
import Head from 'next/head';
import HomePageContainer from '../components/containers/HomePageContainer';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Movie Tracker</title>
        <meta name="description" content="Movie Tracker | Search" />
        <meta name="google-site-verification" content="mvm-MZ-kTgUqAnmKIIIpaH0MON12PMmlwqfG1hPdY74" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomePageContainer />
    </>
  );
};

export default Home;
