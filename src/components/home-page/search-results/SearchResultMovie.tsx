import React, { FC } from 'react';
import UiCard from '../../ui/card/UiCard';
import styles from './search-results.module.scss';
import ScoreCircle from '../../core/score-circle/ScoreCircle';
import FavoriteBtn from '../../core/favorite-btn/FavoriteBtn';
import { SearchResponse } from '../../../types/SearchResponse';
import useTranslation from 'next-translate/useTranslation';
import LinkToDetails from '../../core/details/link-to-details/LinkToDetails';

interface Props {
  item: SearchResponse.ResultItem;
}

const SearchResultMovie: FC<Props> = ({ item }) => {
  const release = new Date(`${item.release_date || item.first_air_date}`).toLocaleDateString();
  const { t } = useTranslation('card');

  return (
    <UiCard
      image={item.poster_path}
      title={item.title || item.name}
      date={`${t('release_date')} ${release}`}
      link={`details/${item.media_type}/${item.id}`}
    >
      <div className={styles['score_container']}>
        <ScoreCircle value={item.vote_average} />
      </div>

      <div className={styles['favorite_container']}>
        <FavoriteBtn id={item.id} className={styles['favorite_btn']} mediaType={item.media_type} />
      </div>

      <LinkToDetails mediaId={item.id} mediaType={item.media_type} />
    </UiCard>
  );
};

export default SearchResultMovie;
