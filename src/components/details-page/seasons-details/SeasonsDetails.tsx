import { SeasonDetails } from '@/types/SeasonDetails';
import { useGetMovieDetails, useGetTvSeriesDetails } from '@/hooks/useTmdbApi';
import useTranslation from 'next-translate/useTranslation';
import { SeasonDetailsItem } from '@/components/details-page/seasons-details/seasons-details-item/SeasonDetailsItem';
import styles from './seasons-details.module.scss';
import { useMemo } from 'react';
import { minsToTimeConverter } from '@/utils/minsToTimeConverter';
import Link from 'next/link';
import { ContentNames } from '@/types/Enums';

interface SeasonsDetailsProps {
  initialData: SeasonDetails.RootObjectWithDetails;
  mediaType: string;
  locale: string;
}

export const SeasonsDetails = ({ mediaType, locale, initialData }: SeasonsDetailsProps) => {
  const { t } = useTranslation('');
  const { data: details, isLoading: isLoadingDetails } = useGetMovieDetails(initialData.details.id, mediaType, locale, initialData.details);
  const { data: seasons, isLoading: isLoadingSeasons } = useGetTvSeriesDetails(initialData.details.id, mediaType, locale, initialData.seasons);

  const totalDuration = useMemo(() => {
    return minsToTimeConverter(
      seasons?.reduce((acc, season) => {
        season.episodes.forEach((el) => {
          acc += el.runtime;
        });

        return acc;
      }, 0) || 0
    );
  }, [seasons]);

  return (
    <div>
      {details && (
        <div className={styles['details']}>
          <h2 className={styles['title']}>
            {t('details:movie_details.list_of_episodes')} «
            <Link href={`/details/${ContentNames.Series}/${details.id}`}>{details.title || details.name}</Link>»
          </h2>
          <p>
            {t('details:movie_details.seasons_count')} <span>{details.number_of_seasons}</span>
          </p>
          <p>
            {t('details:movie_details.episodes_count')} <span>{details.number_of_episodes}</span>
          </p>
          <p>
            {t('details:movie_details.total_viewing_time')}{' '}
            <span>
              {!!totalDuration.days && `${totalDuration.days} ${t('general:days')}`}{' '}
              {!!totalDuration.hours && `${totalDuration.hours} ${t('general:hours')}`}{' '}
              {!!totalDuration.minutes && `${totalDuration.minutes} ${t('general:minutes')}`}
            </span>
          </p>
        </div>
      )}
      {seasons && !isLoadingSeasons && seasons?.map((el, index) => <SeasonDetailsItem key={index} season={el} />)}
    </div>
  );
};
