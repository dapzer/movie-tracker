import React, { FC } from 'react';
import styles from './favorite-card.module.scss';
import { Details } from '../../../types/Details';
import UiCard from '../../ui/card/UiCard';
import ScoreCircle from '../../core/score-circle/ScoreCircle';
import FavoriteBtn from '../../core/favorite-btn/FavoriteBtn';
import SeriesControls from '../series-controls/SeriesControls';
import UiDropdown from '../../ui/dropdown/UiDropdown';
import { ContentNames } from '../../../types/ContentNames';
import DetailsModal from '../../core/details/DetailsModal';
import useTranslation from 'next-translate/useTranslation';
import { useFavorite } from '../../../hooks/useFavorite';

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
        <UiCard
          title={details.title || details.name}
          image={details.poster_path}
          date={`${t('added_date')} ${new Date(favoriteData.addedDate || '').toLocaleDateString()}`}
        >
          <div className={styles['favorite-card__score']}>
            <ScoreCircle value={Number(details.vote_average.toFixed(1))} />
          </div>

          <div className={styles['favorite-card__favorite-btn']}>
            <FavoriteBtn id={details.id} className={'favorite-btn__movie-card-btn'} mediaType={favoriteData.mediaType} />
          </div>

          <DetailsModal mediaType={favoriteData.mediaType} mediaId={favoriteData.id} />

          {favoriteData.mediaType === ContentNames.Series && (
            <UiDropdown title={t('tracking_menu.title')}>
              <SeriesControls favoriteData={favoriteData} seasons={details.seasons} />
            </UiDropdown>
          )}
        </UiCard>
      )}
    </div>
  );
};

export default FavoriteCard;
