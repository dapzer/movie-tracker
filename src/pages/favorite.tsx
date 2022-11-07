import React, { FC } from 'react';
import Head from 'next/head';
import FavoritePageContainer from '../components/containers/favorite-page/FavoritePageContainer';

const Favorite: FC = () => {
  return (
    <div>
      <Head>
        <title>Movie Tracker | Избранное</title>
        <meta name="description" content="Movie Tracker | Favorite" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FavoritePageContainer />
    </div>
  );
};

export default Favorite;
