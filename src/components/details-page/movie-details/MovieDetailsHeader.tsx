import React, { FC } from 'react';
import { arrayToString } from '../../../utils/arrayToString';
import { getMovieDirectors } from '../../../utils/getMovieDirectors';
import { toCurrency } from '../../../utils/toCurrency';
import { Details } from '../../../types/Details';
import { Credits } from '../../../types/Credits';
import { ContentNames } from '../../../types/ContentNames';
import UiInfoHeader from '../../ui/imfo-header/UiInfoHeader';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  details: Details.RootObject;
  credits?: Credits.RootObject;
  mediaType: string;
}

const MovieDetailsHeader: FC<Props> = ({details, credits, mediaType}) => {
  const {t, lang} = useTranslation('details');

  const release = new Date(`${details?.release_date || details?.first_air_date}`).toLocaleDateString();
  const producers = mediaType === ContentNames.Movie && credits && getMovieDirectors(credits.crew)

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
      {details.vote_average > 0 && (
        <li>
          {t('movie_details.user_score')}
          <span> {Number(details.vote_average.toFixed(1))}</span>
        </li>
      )}

      {(details.production_countries?.length > 0 || details.origin_country?.length > 0) && (
        <li>
          {t('movie_details.production_country')}
          <span> {arrayToString(details.production_countries, 'name') || arrayToString(details.origin_country)}</span>
        </li>
      )}

      {producers && producers.length > 0 && (
        <li>
          {t('movie_details.producer')} <span>{arrayToString(producers, 'name')}</span>
        </li>
      )}

      {details.created_by?.length > 0 && (
        <li>
          {t('movie_details.creator')} <span>{arrayToString(details.created_by, 'name')}</span>
        </li>
      )}

      {details.production_companies?.length > 0 && (
        <li>
          {t('movie_details.production_companies')}
          <span> {arrayToString(details.production_companies, 'name')}</span>
        </li>
      )}

      {details.genres?.length > 0 && (
        <li>
          {t('movie_details.genre')} <span>{arrayToString(details.genres, 'name')}</span>
        </li>
      )}

      {details?.budget > 0 && (
        <li>
          {t('movie_details.budget')} <span>{toCurrency(details.budget, 'USD', lang)}</span>
        </li>
      )}

      {release !== "Invalid Date" && (
        <li>
          {t('movie_details.release_date')} <span>{release}</span>
        </li>
      )}

      {mediaType === ContentNames.Series && (
        <>
          {details.last_air_date && (
            <li>
              {t('movie_details.last_air_date')} <span>{new Date(details.last_air_date).toLocaleDateString()}</span>
            </li>)}
          {details.next_episode_to_air && (
            <li>
              {t('movie_details.next_air_date')}
              <span> {new Date(details.next_episode_to_air.air_date).toLocaleDateString()}</span>
            </li>
          )}
          <li>
            {t('movie_details.series_status')}
            <span> {lang === 'ru' ? (details.in_production ? 'В производстве' : 'Завершён') : details.status}</span>
          </li>
          <li>
            {t('movie_details.seasons_count')} <span>{details.number_of_seasons}</span>
          </li>
          <li>
            {t('movie_details.episodes_count')} <span>{details.number_of_episodes}</span>
          </li>
        </>
      )}

      {(details.runtime || details.episode_run_time?.length > 0) && (
        <li>
          {t(details.episode_run_time ? 'movie_details.series_runtime' : 'movie_details.movie_runtime')}{' '}
          <span>
            {details.runtime || arrayToString(details.episode_run_time)} {t('movie_details.runtime_mins')}
          </span>
        </li>
      )}
    </UiInfoHeader>
  );
};

export default MovieDetailsHeader;
