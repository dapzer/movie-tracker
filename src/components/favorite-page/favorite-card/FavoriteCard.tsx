import React, { FC } from 'react';
import styles from './favorite-card.module.scss';
import { Details } from '../../../types/Details';
import SeriesControls from '../series-controls/SeriesControls';
import UiDetails from '../../ui/details/UiDetails';
import { ContentNames } from '../../../types/Enums';
import useTranslation from 'next-translate/useTranslation';
import { useFavorite } from '../../../hooks/useFavorite';
import StatusSelector from '../status-selector/StatusSelector';
import MovieCard from '../../core/movie-card/MovieCard';

interface Props {
  details: Details.RootObject;
}

const FavoriteCard: FC<Props> = ({ details }) => {
  const { getFavoriteItem } = useFavorite();
  const { t } = useTranslation('favoritePage');
  const favoriteItem = getFavoriteItem(details.id);

  return (
    <div>
      {favoriteItem && (
        <MovieCard
          mediaType={favoriteItem.mediaType}
          mediaId={details.id}
          score={details.vote_average}
          title={details.title || details.name}
          image={details.poster_path}
          releaseDate={new Date(favoriteItem.addedDate || '')}
          dateTitle={t('added_date')}
          showScore
        >
          <div className={styles['status_selector']}>
            <StatusSelector mediaType={favoriteItem.mediaType} id={details.id} currentStatus={favoriteItem.trackingData.currentStatus} />
          </div>

          {favoriteItem.mediaType === ContentNames.Series && (
            <UiDetails title={t('tracking_menu.title')}>
              <SeriesControls favoriteItem={favoriteItem} seasons={details.seasons} />
            </UiDetails>
          )}
        </MovieCard>
      )}
    </div>
  );
};

export default FavoriteCard;
