import { SeasonDetails } from '@/types/SeasonDetails';
import { useGetMovieDetails, useGetTvSeriesDetails } from '@/hooks/useTmdbApi';
import useTranslation from 'next-translate/useTranslation';
import { SeasonDetailsItem } from '@/components/details-page/seasons-details/seasons-details-item/SeasonDetailsItem';
import styles from './seasons-details.module.scss';

interface SeasonsDetailsProps {
  initialData: SeasonDetails.RootObjectWithDetails;
  mediaType: string;
  locale: string;
}

export const SeasonsDetails = ({ mediaType, locale, initialData }: SeasonsDetailsProps) => {
  const { t } = useTranslation('details');
  const { data: details, isLoading: isLoadingDetails } = useGetMovieDetails(initialData.details.id, mediaType, locale, initialData.details);
  const { data: seasons, isLoading: isLoadingSeasons } = useGetTvSeriesDetails(initialData.details.id, mediaType, locale, initialData.seasons);

  return (
    <div>
      {details && (
        <div className={styles['details']}>
          <h2>{t('movie_details.list_of_episodes', { title: details.title || details.name })}</h2>
          <p>
            {t('movie_details.seasons_count')} {details.number_of_seasons}
          </p>
          <p>
            {t('movie_details.episodes_count')} {details.number_of_episodes}
          </p>
        </div>
      )}
      {seasons && !isLoadingSeasons && seasons?.map((el, index) => <SeasonDetailsItem key={index} season={el} />)}
    </div>
  );
};
