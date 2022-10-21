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

interface Props {
  mediaId?: number;
  mediaType?: string;
}

const Details: FC<Props> = ({ mediaType, mediaId }) => {
  const { data: details } = useQuery<Details.RootObject>(
    [
      'getDetails',
      {
        mediaId: mediaId,
        mediaType: mediaType,
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
            <h2>Описание {mediaType === ContentNames.Movie ? 'фильма' : 'сериала'}</h2>
            <p>{details.overview}</p>
          </div>

          {credits.cast.length > 0 && (
            <div className={styles['']}>
              <h2>Актёры</h2>
              <div className={'details-grid'}>
                {credits.cast.map((item) => (
                  <UiCard
                    key={`person-${item.id}`}
                    title={item.name}
                    image={item.profile_path}
                    horizontal
                  >
                    <ul>
                      {item.total_episode_count && <li>В {item.total_episode_count} эпизодах</li>}

                      {item?.roles?.length > 0 ? (
                        <li>Роли(и): {arrayToString(item.roles, 'character')}</li>
                      ) : (
                        <li>Роль(и): {item.character}</li>
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
