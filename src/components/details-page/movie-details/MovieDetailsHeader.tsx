import React, { FC } from 'react';
import { arrayToString } from '@/utils/arrayToString';
import { getMovieDirectors } from '@/utils/getMovieDirectors';
import { toCurrency } from '@/utils/toCurrency';
import { Details } from '@/types/Details';
import { Credits } from '@/types/Credits';
import { ContentNames } from '@/types/Enums';
import UiInfoHeader from '@/components/ui/imfo-header/UiInfoHeader';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import MovieDetailsProducers from '@/components/details-page/movie-details/MovieDetailsProducers';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {
  details: Details.RootObject;
  credits?: Credits.RootObject | null;
  mediaType: string;
}

const MovieDetailsHeader: FC<Props> = ({ details, credits, mediaType }) => {
  const { t, lang } = useTranslation('details');

  const release = new Date(`${details?.release_date || details?.first_air_date}`).toLocaleDateString(lang);
  const producers = mediaType === ContentNames.Movie && credits && getMovieDirectors(credits.crew);

  return (
    <UiInfoHeader
      original_title={details.original_title || details.original_name}
      title={`${details.title || details.name}`}
      image={details.poster_path}
      favoriteItem={{
        media_type: mediaType,
        id: details.id,
      }}
    >
      {!!details.vote_average && (
        <li>
          {t('movie_details.user_score')}
          <Typography as="span" variant="listItem">
            {' '}
            {Number(details.vote_average.toFixed(1))}
          </Typography>
        </li>
      )}

      {(!!details.production_countries?.length || !!details.origin_country?.length) && (
        <li>
          {t('movie_details.production_country')}
          <Typography as="span" variant="listItem">
            {' '}
            {arrayToString(details.production_countries, 'name') || arrayToString(details.origin_country)}
          </Typography>
        </li>
      )}

      {producers && !!producers.length && (
        <li>
          {t('movie_details.producer')}{' '}
          <Typography as="span" variant="listItem">
            <MovieDetailsProducers producers={producers} />
          </Typography>
        </li>
      )}

      {!!details.created_by?.length && (
        <li>
          {t('movie_details.creator')}{' '}
          <Typography as="span" variant="listItem">
            <MovieDetailsProducers producers={details.created_by} />
          </Typography>
        </li>
      )}

      {!!details.production_companies?.length && (
        <li>
          {t('movie_details.production_companies')}
          <Typography as="span" variant="listItem">
            {' '}
            {arrayToString(details.production_companies, 'name')}
          </Typography>
        </li>
      )}

      {!!details.genres?.length && (
        <li>
          {t('movie_details.genre')}{' '}
          <Typography as="span" variant="listItem">
            {arrayToString(details.genres, 'name')}
          </Typography>
        </li>
      )}

      {!!details?.budget && (
        <li>
          {t('movie_details.budget')}{' '}
          <Typography as="span" variant="listItem">
            {toCurrency(details.budget, 'USD', lang)}
          </Typography>
        </li>
      )}

      {release !== 'Invalid Date' && (
        <li>
          {t('movie_details.release_date')}{' '}
          <Typography as="span" variant="listItem">
            {release}
          </Typography>
        </li>
      )}

      {mediaType === ContentNames.Series && (
        <>
          {details.last_air_date && (
            <li>
              {t('movie_details.last_air_date')}{' '}
              <Typography as="span" variant="listItem">
                {new Date(details.last_air_date).toLocaleDateString(lang)}
              </Typography>
            </li>
          )}
          {details.next_episode_to_air && (
            <li>
              {t('movie_details.next_air_date')}
              <Typography as="span" variant="listItem">
                {' '}
                {new Date(details.next_episode_to_air.air_date).toLocaleDateString(lang)}
              </Typography>
            </li>
          )}
          <li>
            {t('movie_details.series_status')}
            <Typography as="span" variant="listItem">
              {' '}
              {lang === 'ru' ? t(`movie_details.series_statuses.${details.status.toLowerCase()}`) : details.status}
            </Typography>
          </li>
          <li>
            {t('movie_details.seasons_count')}{' '}
            <Typography as="span" variant="listItem">
              {details.number_of_seasons}
            </Typography>
          </li>
          <li>
            {t('movie_details.episodes_count')}{' '}
            <Typography as="span" variant="listItem">
              {details.number_of_episodes} (
              <Typography as={Link} variant="linkUnderlined" href={`/details/${mediaType}/${details.id}/seasons`}>
                {t('movie_details.episode_list')}
              </Typography>
              )
            </Typography>
          </li>
        </>
      )}

      {(details.runtime || !!details.episode_run_time?.length) && (
        <li>
          {t(details.episode_run_time ? 'movie_details.series_runtime' : 'movie_details.movie_runtime')}{' '}
          <Typography as="span" variant="listItem">
            {details.runtime || arrayToString(details.episode_run_time)} {t('movie_details.runtime_mins')}
          </Typography>
        </li>
      )}
    </UiInfoHeader>
  );
};

export default MovieDetailsHeader;
