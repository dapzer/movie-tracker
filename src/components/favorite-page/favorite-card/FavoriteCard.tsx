import React, { FC } from 'react';
import styles from './favorite-card.module.scss';
import { Details } from '../../../types/Details';
import SeriesControls from '../series-controls/SeriesControls';
import UiDetails from '../../ui/details/UiDetails';
import { ContentNames } from '../../../types/ContentNames';
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
  const favoriteData = getFavoriteItem(details.id);

  return (
    <div>
      {favoriteData && (
        <MovieCard
          mediaType={favoriteData.mediaType!}
          mediaId={details.id}
          score={details.vote_average}
          title={details.title || details.name}
          image={details.poster_path}
          releaseDate={new Date(favoriteData.addedDate || '')}
          dateTitle={t('added_date')}
          showScore
        >
          <div className={styles['status_selector']}>
            <StatusSelector mediaType={favoriteData.mediaType} id={details.id} currentStatus={favoriteData.currentStatus} />
          </div>

          {favoriteData.mediaType === ContentNames.Series && (
            <UiDetails title={t('tracking_menu.title')}>
              <SeriesControls favoriteData={favoriteData} seasons={details.seasons} />
            </UiDetails>
          )}
        </MovieCard>
      )}
    </div>
  );
};

export default FavoriteCard;
