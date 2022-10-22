import React, { FC } from 'react';
import styles from './details.module.scss';
import { useQuery } from '@tanstack/react-query';
import { creditsApi, detailApi } from '../../../api/fetchApi';
import { Credits } from '../../../types/Credits';
import { Details } from '../../../types/Details';
import DetailsHeader from './DetailsHeader';
import { ContentNames } from '../../../types/ContentNames';
import UiCard from '../../ui/card/UiCard';
import { arrayToString } from '../../../utils/arrayToString.helper';
import PersonModal from '../person-details/PersonModal';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  mediaId?: number;
  mediaType?: string;
}

const Details: FC<Props> = ({ mediaType, mediaId }) => {
  const { t, lang } = useTranslation('details');

  const { data: details } = useQuery<Details.RootObject>(
    [
      'getDetails',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    detailApi
  );

  const { data: credits } = useQuery<Credits.RootObject>(
    [
      'getCredits',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    creditsApi
  );

  return (
    <>
      {details && credits && (
        <div className={styles['details']}>
          <DetailsHeader details={details} credits={credits} mediaType={mediaType} />

          <div className={styles['details__about']}>
            <h2>
              {t(
                mediaType === ContentNames.Movie
                  ? 'movie_details.movie_description'
                  : 'movie_details.series_description'
              )}
            </h2>
            <p>{details.overview}</p>
          </div>

          {credits.cast.length > 0 && (
            <div className={styles['']}>
              <h2>{t('movie_details.actors_title')}</h2>
              <div className={'details-grid'}>
                {credits.cast.map((item) => (
                  <UiCard
                    key={`person-${item.id}`}
                    title={item.name}
                    image={item.profile_path}
                    horizontal
                  >
                    <ul>
                      {item.total_episode_count && (
                        <li>
                          {t('movie_details.actors_episodesCount', {
                            episodes: item.total_episode_count,
                          })}
                        </li>
                      )}

                      {item?.roles?.length > 0 ? (
                        <li>
                          {t('movie_details.actors_roles')} {arrayToString(item.roles, 'character')}
                        </li>
                      ) : (
                        <li>
                          {t('movie_details.actors_roles')} {item.character}
                        </li>
                      )}
                    </ul>

                    <PersonModal personData={item} />
                  </UiCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Details;
