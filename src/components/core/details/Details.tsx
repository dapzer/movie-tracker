import React, { FC } from 'react';
import styles from './details.module.scss';
import { useQuery } from '@tanstack/react-query';
import { creditsApi, detailApi } from '../../../api/searchApi';
import { Credits } from '../../../types/Credits';
import { Details } from '../../../types/Details';
import DetailsHeader from './DetailsHeader';
import DetailsPerson from './DetailsPerson';

interface Props {
  showId?: number;
  showType?: string;
}

const Details: FC<Props> = ({ showType, showId }) => {
  const { data: details } = useQuery<Details.RootObject>(
    [
      'getDetails',
      {
        showId: showId,
        showType: showType,
      },
    ],
    detailApi
  );

  const { data: credits } = useQuery<Credits.RootObject>(
    [
      'getCredits',
      {
        showId: showId,
        showType: showType,
      },
    ],
    creditsApi
  );

  return (
    <>
      {details && credits && (
        <div className={styles['details']}>
          <DetailsHeader details={details} credits={credits} showType={showType} />

          <div className={styles['details__about']}>
            <h2>Описание {showType === 'movie' ? 'фильма' : 'сериала'}</h2>
            <p>{details.overview}</p>
          </div>

          {credits.cast.length > 0 && (
            <div className={styles['']}>
              <h2>Актёры</h2>
              <div className={styles['details__persons-row']}>
                {credits.cast.splice(0, 10).map((person) => (
                  <DetailsPerson key={person.id} person={person} />
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
