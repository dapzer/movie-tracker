import styles from './favorite-card.module.scss';
import { Details } from '@/types/Details';
import useTranslation from 'next-translate/useTranslation';
import { useFavorite } from '@/hooks/useFavorite';
import { StatusSelector } from '@/components/favorite-page/tracking-menu/status-selector/StatusSelector';
import { MovieCard } from '@/components/core/movie-card/MovieCard';
import { TrackingMenu } from '@/components/favorite-page/tracking-menu/TrackingMenu';

interface FavoriteCardProps {
  details: Details.RootObject;
}

export const FavoriteCard = (props: FavoriteCardProps) => {
  const { details } = props;
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

          <TrackingMenu favoriteItem={favoriteItem} details={details} />
        </MovieCard>
      )}
    </div>
  );
};
