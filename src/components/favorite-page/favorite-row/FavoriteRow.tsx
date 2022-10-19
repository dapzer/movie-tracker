import React, { FC, useEffect, useState } from 'react';
import styles from './favorite-row.module.scss';
import Masonry from 'react-masonry-css';
import { useQueries } from '@tanstack/react-query';
import { detailApi } from '../../../api/fetchApi';
import { LocalStorageMovie } from '../../../types/LocalStorageMovie';
import FavoriteCard from '../favorite-card/FavoriteCard';

interface Props {}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const FavoriteRow: FC<Props> = () => {
  const [localStorageData, setLocalStorageData] = useState<LocalStorageMovie.RootObject[]>([]);

  const getLocalStorageData = (): LocalStorageMovie.RootObject[] => {
    const localStorageData = [];

    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) {
        continue;
      }

      try {
        const movie = JSON.parse(localStorage[key]);

        if (movie.hasOwnProperty('showType')) {
          localStorageData.push(movie);
        }
      } catch (e: any) {
        throw new Error(e.data);
      }
    }

    return localStorageData;
  };

  useEffect(() => {
    setLocalStorageData(getLocalStorageData());
  }, []);

  const data = useQueries({
    queries: localStorageData.map((item) => {
      return {
        queryKey: [
          'getDetailFromFavorite',
          {
            showType: item.showType,
            showId: item.id,
          },
        ],
        queryFn: detailApi,
        enabled: localStorageData.length > 1,
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
        {data &&
          data.map(
            (value) => value.data && <FavoriteCard key={value.data.id} details={value.data} />
          )}
      </Masonry>
    </div>
  );
};

export default FavoriteRow;
