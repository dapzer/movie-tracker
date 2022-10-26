import React, { FC } from 'react';
import styles from './favorite-row.module.scss';
import Masonry from 'react-masonry-css';
import { useQueries } from '@tanstack/react-query';
import { detailApi } from '../../../api/fetchApi';
import FavoriteCard from '../favorite-card/FavoriteCard';
import useTranslation from 'next-translate/useTranslation';
import { useFavoriteContext } from '../../../context/FavoriteContext';

interface Props {}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const FavoriteRow: FC<Props> = () => {
  const { favoriteList } = useFavoriteContext();
  const { t, lang } = useTranslation('favoritePage');

  const data = useQueries({
    queries: favoriteList.map((item) => {
      return {
        queryKey: [
          'getDetailFromFavorite',
          {
            mediaType: item.mediaType,
            mediaId: item.id,
            language: lang,
          },
        ],
        queryFn: detailApi,
      };
    }),
  });

  return (
    <div className={styles['favorite-row']}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="searching-results-masonry__row"
        columnClassName="searching-results-masonry__row-column"
      >
        {data && data.map((value) => value.data && <FavoriteCard key={value.data.id} details={value.data} />)}
      </Masonry>
    </div>
  );
};

export default FavoriteRow;
