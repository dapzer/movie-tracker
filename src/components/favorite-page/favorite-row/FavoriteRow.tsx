import React, { FC } from 'react';
import Masonry from 'react-masonry-css';
import FavoriteCard from '@/components/favorite-page/favorite-card/FavoriteCard';
import useTranslation from 'next-translate/useTranslation';
import { FavoriteList } from '@/types/FavoriteList';
import UiDetails from '@/components/ui/details/UiDetails';
import Skeleton from 'react-loading-skeleton';
import CardSkeleton from '@/lib/loading-skeleton/CardSkeleton';
import { useGetFavoriteItemsDetail } from '@/hooks/useTmdbApi';

interface Props {
  favoriteList: FavoriteList.RootObject[];
  title: string;
  isOpenedDefault?: boolean;
  additionalOpenHandler?: () => void;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const FavoriteRow: FC<Props> = ({ favoriteList, title, additionalOpenHandler, isOpenedDefault }) => {
  const { lang } = useTranslation('favoritePage');
  const data = useGetFavoriteItemsDetail(favoriteList, lang);

  return (
    <UiDetails title={title} isLarge isOpenedDefault={isOpenedDefault} additionalOpenHandler={additionalOpenHandler}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="searching-results-masonry__row"
        columnClassName="searching-results-masonry__row-column"
      >
        {data &&
          data.map((value, index) =>
            value.status === 'loading' ? (
              <CardSkeleton key={index}>
                <Skeleton width={50} height={'1em'} />
              </CardSkeleton>
            ) : (
              value.data && <FavoriteCard key={`favorite-item-${value.data.id}`} details={value.data} />
            )
          )}
      </Masonry>
    </UiDetails>
  );
};

export default FavoriteRow;
