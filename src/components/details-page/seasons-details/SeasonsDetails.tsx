import { SeasonDetails } from '@/types/SeasonDetails';
import { useGetMovieDetails, useGetTvSeriesDetails } from '@/hooks/useTmdbApi';
import useTranslation from 'next-translate/useTranslation';
import { SeasonDetailsItem } from '@/components/details-page/seasons-details/seasons-details-item/SeasonDetailsItem';
import styles from './seasons-details.module.scss';
import { useMemo } from 'react';
import { minsToTimeConverter } from '@/utils/minsToTimeConverter';
import Link from 'next/link';
import { ContentNames } from '@/types/Enums';
import { Typography } from '@/components/ui/typography/UiTypography';

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
    <>
      {details && (
        <section className={styles['details']}>
          <Typography as="h1" variant="title2" className={styles['title']}>
            {t('details:movie_details.list_of_episodes')} «
            <Typography as={Link} variant="linkUnderlined" href={`/details/${ContentNames.Series}/${details.id}`}>
              {details.title || details.name}
            </Typography>
            »
          </Typography>
          <Typography>
            {t('details:movie_details.seasons_count')}{' '}
            <Typography as="span" variant="listItem">
              {details.number_of_seasons}
            </Typography>
          </Typography>
          <Typography>
            {t('details:movie_details.episodes_count')}{' '}
            <Typography as="span" variant="listItem">
              {details.number_of_episodes}
            </Typography>
          </Typography>
          {(!!totalDuration.minutes || totalDuration.hours || !!totalDuration.days) && (
            <Typography>
              {t('details:movie_details.total_viewing_time')}{' '}
              <Typography as="span" variant="listItem">
                {!!totalDuration.days && `${totalDuration.days} ${t('general:days')}`}{' '}
                {!!totalDuration.hours && `${totalDuration.hours} ${t('general:hours')}`}{' '}
                {!!totalDuration.minutes && `${totalDuration.minutes} ${t('general:minutes')}`}
              </Typography>
            </Typography>
          )}
        </section>
      )}
      <section>{seasons && !isLoadingSeasons && seasons?.map((el, index) => <SeasonDetailsItem key={index} season={el} />)}</section>
    </>
  );
};
