import React, { FC } from 'react';
import { SearchItem } from '../../../types/SearchItem';
import DetailsModal from '../../core/details-modal/DetailsModal';
import UiCard from '../../ui/card/UiCard';

interface Props {
  item: SearchItem;
}

const SearchResultMovie: FC<Props> = ({ item }) => {
  const release = new Date(`${item.release_date || item.first_air_date}`).toLocaleDateString();

  return (
    <UiCard
      image={item.poster_path}
      title={item.title || item.name}
      date={`Дата выхода: ${release}`}
    >
      <DetailsModal showId={item.id} showType={item.media_type} />
    </UiCard>
  );
};

export default SearchResultMovie;
