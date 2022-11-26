import React, { FC } from 'react';
import UiCard from '../../ui/card/UiCard';
import styles from './movie-card.module.scss';
import FavoriteBtn from '../favorite-btn/FavoriteBtn';
import LinkToDetails from '../details/link-to-details/LinkToDetails';
import ScoreCircle from '../score-circle/ScoreCircle';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  children?: React.ReactNode;
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

const MovieCard: FC<Props> = ({
  children,
  image,
  small,
  horizontal,
  showScore,
  width,
  title,
  mediaType,
  mediaId,
  releaseDate,
  score,
  favoriteBtn,
  dateTitle,
}) => {
  const release = new Date(`${releaseDate}`).toLocaleDateString();
  const { t } = useTranslation('card');

  return (
    <UiCard
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
          <FavoriteBtn id={mediaId} className={styles['favorite_btn']} mediaType={mediaType} />
        </div>
      )}

      <LinkToDetails mediaId={mediaId} mediaType={mediaType} />

      {children}
    </UiCard>
  );
};

export default MovieCard;
