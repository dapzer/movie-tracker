import React, { FC } from 'react';
import styles from './favorite-card.module.scss';
import { Details } from '../../../types/Details';
import UiCard from '../../ui/card/UiCard';
import DetailsModal from '../../core/details-modal/DetailsModal';
import ScoreCircle from '../../core/score-circle/ScoreCircle';
import FavoriteBtn from '../../core/favorite-btn/FavoriteBtn';
import SeriesControls from '../series-controls/SeriesControls';
import UiDropdown from '../../ui/dropdown/UiDropdown';

interface Props {
  details: Details.RootObject;
}

const FavoriteCard: FC<Props> = ({ details }) => {
  const storageData = JSON.parse(localStorage.getItem(details.id.toString()) || '');
  return (
    <div>
      <UiCard
        title={details.title || details.name}
        image={details.poster_path}
        date={`Дата добавления: ${new Date(storageData.addedDate).toLocaleDateString()}`}
      >
        <div className={styles['favorite-card__score']}>
          <ScoreCircle value={Number(details.vote_average.toFixed(1))} />
        </div>

        <div className={styles['favorite-card__favorite-btn']}>
          <FavoriteBtn
            id={details.id}
            className={'favorite-btn__movie-card-btn'}
            showType={storageData.showType}
          />
        </div>

        <DetailsModal showType={storageData.showType} showId={storageData.id} />

        {storageData.showType === 'tv' && (
          <UiDropdown title={'Трекинг меню'}>
            <SeriesControls storageData={storageData} seasons={details.seasons} />
          </UiDropdown>
        )}
      </UiCard>
    </div>
  );
};

export default FavoriteCard;
