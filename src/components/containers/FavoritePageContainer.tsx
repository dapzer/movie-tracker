import React, { FC } from 'react';
import FavoriteRow from '../favorite-page/favorite-row/FavoriteRow';

interface Props {}

const FavoritePageContainer: FC<Props> = () => {
  return (
    <div className={'container'}>
      <h2>Ваш список избранного</h2>
      <FavoriteRow />
    </div>
  );
};

export default FavoritePageContainer;
