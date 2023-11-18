import { UiCard } from '@/components/ui/card/UiCard';
import styles from './movie-card.module.scss';
import { FavoriteBtn } from '@/components/core/favorite-btn/FavoriteBtn';
import { LinkToDetails } from '@/components/core/details/link-to-details/LinkToDetails';
import { ScoreCircle } from '@/components/core/score-circle/ScoreCircle';
import useTranslation from 'next-translate/useTranslation';
import { StatusSelector } from '@/components/favorite-page/tracking-menu/status-selector/StatusSelector';
import { StatusesNames } from '@/types/Enums';
import { useFavorite } from '@/hooks/useFavorite';
import { ReactNode } from 'react';

interface MovieCardProps {
  children?: ReactNode;
  small?: boolean;
  title?: string;
  releaseDate?: string | Date;
  mediaType: string;
  mediaId: number;
  width?: string;
  horizontal?: boolean;
  score?: number;
  showScore?: boolean;
  favoriteBtn?: boolean;
  image?: string;
  dateTitle?: string;
}

export const MovieCard = (props: MovieCardProps) => {
  const { children, image, small, horizontal, showScore, width, title, mediaType, mediaId, releaseDate, score, favoriteBtn, dateTitle } = props;
  const { t, lang } = useTranslation('card');
  const release = new Date(`${releaseDate}`).toLocaleDateString(lang);
  const { getFavoriteItem, isFavorite } = useFavorite(mediaId);
  const favoriteItem = isFavorite ? getFavoriteItem(mediaId) : null;

  return (
    <UiCard
      horizontal={horizontal}
      small={small}
      image={image}
      title={title}
      date={`${dateTitle || t('release_date')} ${release}`}
      width={width}
      link={`details/${mediaType}/${mediaId}`}
    >
      {showScore && (
        <div className={styles['score_container']}>
          <ScoreCircle value={Number(score?.toFixed(1))} />
        </div>
      )}

      {favoriteBtn && (
        <div className={styles['favorite_container']}>
          <StatusSelector
            id={mediaId}
            mediaType={mediaType}
            currentStatus={favoriteItem?.trackingData.currentStatus || StatusesNames.notViewed}
            trigger={
              <div className={styles['trigger_wrapper']}>
                <FavoriteBtn id={mediaId} className={styles['favorite_btn']} mediaType={mediaType} asListTrigger />
              </div>
            }
          />
        </div>
      )}

      <LinkToDetails mediaId={mediaId} mediaType={mediaType} />

      {children}
    </UiCard>
  );
};