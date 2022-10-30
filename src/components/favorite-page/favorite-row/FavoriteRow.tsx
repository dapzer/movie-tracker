import React, { FC } from 'react';
import styles from './favorite-row.module.scss';
import Masonry from 'react-masonry-css';
import { useQueries } from '@tanstack/react-query';
import { detailApi } from '../../../api/fetchApi';
import FavoriteCard from '../favorite-card/FavoriteCard';
import useTranslation from 'next-translate/useTranslation';
import { FavoriteList } from '../../../types/FavoriteList';
import UiDropdown from '../../ui/dropdown/UiDropdown';

interface Props {
  favoriteList: FavoriteList.RootObject[];
  title: string;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const FavoriteRow: FC<Props> = ({ favoriteList, title }) => {
  const { lang } = useTranslation('favoritePage');

  const data = useQueries({
    queries: favoriteList.map((item) => {
      return {
        queryKey: [
          'getDetails',
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
    <UiDropdown title={title} btnClass={styles['favorite-row__dropdown-btn']} isOpenedDefault>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="searching-results-masonry__row"
        columnClassName="searching-results-masonry__row-column"
      >
        {data && data.map((value, index) => value.data && <FavoriteCard key={`favorite-item-${value.data.id}`} details={value.data} />)}
      </Masonry>
    </UiDropdown>
  );
};

export default FavoriteRow;
