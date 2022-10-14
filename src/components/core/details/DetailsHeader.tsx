import React, { FC } from 'react';
import styles from './details.module.scss';
import Image from 'next/image';
import { arrayToString } from '../../../utils/arrayToString.helper';
import { getMovieDirectors } from '../../../utils/getMovieDirectors.helper';
import { toCurrency } from '../../../utils/toCurrency.helper';
import { Details } from '../../../types/Details';
import { Credits } from '../../../types/Credits';

interface Props {
  details: Details.RootObject;
  credits: Credits.RootObject;
  showType?: string;
}

const DetailsHeader: FC<Props> = ({ details, credits, showType }) => {
  const release = new Date(
    `${details?.release_date || details?.first_air_date}`
  ).toLocaleDateString();

  const isHaveOriginalName =
    (details?.title || details?.name) == (details?.original_title || details?.original_name);

  return (
    <div className={styles['details__header']}>
      <div className={styles['details__header__image']}>
        <Image
          src={
            details.poster_path
              ? `https://image.tmdb.org/t/p/original${details.poster_path}`
              : '/defaultPoster.svg'
          }
          width="100"
          height="150"
          objectFit="contain"
          sizes="320"
          alt="Brand logo"
        />
      </div>

      <div className={styles['details__header__info']}>
        <div className={styles['details__header__info__title']}>
          <h2>{details.title || details.name}</h2>
          <h3 hidden={isHaveOriginalName}>{details.original_name || details.original_title}</h3>
        </div>

        <ul className={styles['details__header__info__list']}>
          <li>
            Страна производства: <span>{arrayToString(details.production_countries, 'name')}</span>
          </li>
          {showType === 'movie' && (
            <li>
              Режиссёр: <span>{arrayToString(getMovieDirectors(credits.crew), 'name')}</span>
            </li>
          )}
          {details.created_by && details.created_by.length > 1 && (
            <li>
              Создатель(и): <span>{arrayToString(details.created_by, 'name')}</span>
            </li>
          )}
          <li>
            Кинокомпании: <span>{arrayToString(details.production_companies, 'name')}</span>
          </li>
          <li>
            Жанр: <span>{arrayToString(details.genres, 'name')}</span>
          </li>
          {details?.budget > 0 && (
            <li>
              Бюджет: <span>{toCurrency(details.budget, 'USD')}</span>
            </li>
          )}
          <li>
            Дата выхода: <span>{release}</span>
          </li>
          {showType === 'tv' && (
            <>
              <li>
                Дата выхода последнего эпизода:{' '}
                <span>{new Date(details.last_air_date).toLocaleDateString()}</span>
              </li>
              {details.next_episode_to_air && (
                <li>
                  Дата выхода следующего эпизода:{' '}
                  <span>{new Date(details.next_episode_to_air.air_date).toLocaleDateString()}</span>
                </li>
              )}
              <li>
                Статус сериала: <span>{details.in_production ? 'В производстве' : 'Завершён'}</span>
              </li>
              <li>
                Количество сезонов: <span>{details.number_of_seasons}</span>
              </li>
              <li>
                Количество серий: <span>{details.number_of_episodes}</span>
              </li>
            </>
          )}
          <li>
            {details.episode_run_time ? 'Длительность серии' : 'Длительность'}:{' '}
            <span>{details.episode_run_time || details.runtime} мин.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsHeader;
