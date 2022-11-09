import React, { FC } from 'react';
import styles from './favorite-card.module.scss';
import { Details } from '../../../types/Details';
import UiCard from '../../ui/card/UiCard';
import ScoreCircle from '../../core/score-circle/ScoreCircle';
import SeriesControls from '../series-controls/SeriesControls';
import UiDetails from '../../ui/details/UiDetails';
import { ContentNames } from '../../../types/ContentNames';
import useTranslation from 'next-translate/useTranslation';
import { useFavorite } from '../../../hooks/useFavorite';
import StatusSelector from '../statusSelector/StatusSelector';
import LinkToDetails from '../../core/link-to-details/LinkToDetails';

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
          link={`details/${favoriteData.mediaType}/${details.id}`}
        >
          <div className={styles['favorite-card__score']}>
            <ScoreCircle value={Number(details.vote_average.toFixed(1))} />
          </div>

          <div className={styles['favorite-card__favorite-btn']}>
            <StatusSelector mediaType={favoriteData.mediaType} id={details.id} currentStatus={favoriteData.currentStatus} />
          </div>

          <LinkToDetails mediaType={favoriteData.mediaType} mediaId={favoriteData.id} />

          {favoriteData.mediaType === ContentNames.Series && (
            <UiDetails title={t('tracking_menu.title')}>
              <SeriesControls favoriteData={favoriteData} seasons={details.seasons} />
            </UiDetails>
          )}
        </UiCard>
      )}
    </div>
  );
};

export default FavoriteCard;
