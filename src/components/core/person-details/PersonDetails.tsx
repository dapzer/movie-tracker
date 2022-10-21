import React, { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Person } from '../../../types/Person';
import { personCreditsApi, personDetailsApi } from '../../../api/fetchApi';
import { SearchResponse } from '../../../types/SearchResponse';
import PersonDetailsHeader from './PersonDetailsHeader';
import styles from './person-details.module.scss';
import UiCard from '../../ui/card/UiCard';
import DetailsModal from '../details/DetailsModal';
import { Credits } from '../../../types/Credits';

interface Props {
  personData: SearchResponse.ResultItem | Person.Cast | Credits.Cast;
}

const PersonDetails: FC<Props> = ({ personData }) => {
  const { data: details } = useQuery<Person.RootObject>(
    [
      'getPersonDetails',
      {
        person_id: personData.id,
      },
    ],
    personDetailsApi
  );

  const { data: credits } = useQuery<Person.Credits>(
    [
      'getPersonCredits',
      {
        person_id: personData.id,
      },
    ],
    personCreditsApi
  );

  return (
    <>
      {details && credits && (
        <>
          <PersonDetailsHeader details={details} />

          <div className={styles['person-details__biography']}>
            <h3>Биография</h3>
            {details.biography.split('\n\n').map((item, index) => (
              <p key={`biography-${index}`}>{item}</p>
            ))}
          </div>

          <div className={styles['person-details__movies']}>
            <h3>Участвовал в</h3>
            <div className={'details-grid'}>
              {credits.cast.map((item, index) => (
                <UiCard
                  key={index}
                  title={item.title || item.name}
                  image={item.poster_path}
                  date={`Дата выхода ${new Date(
                    item.release_date || item.first_air_date
                  ).toLocaleDateString()}`}
                  horizontal
                >
                  <ul>
                    <li>Роль(и): {item.character}</li>
                  </ul>

                  <DetailsModal mediaId={item.id} mediaType={item.media_type} />
                </UiCard>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PersonDetails;
