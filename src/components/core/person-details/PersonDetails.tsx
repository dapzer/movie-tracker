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
import useTranslation from 'next-translate/useTranslation';
import DetailsSkeleton from '../../../lib/loading-skeleton/DetailsSkeleton';

interface Props {
  personData: SearchResponse.ResultItem | Person.Cast | Credits.Cast;
}

const PersonDetails: FC<Props> = ({ personData }) => {
  const { t, lang } = useTranslation('details');

  const {
    data: details,
    isSuccess,
    isLoading,
  } = useQuery<Person.RootObject>(
    [
      'getPersonDetails',
      {
        person_id: personData.id,
        language: lang,
      },
    ],
    personDetailsApi
  );

  const {
    data: credits,
    isSuccess: creditsIsSuccess,
    isLoading: creditsIsLoading,
  } = useQuery<Person.Credits>(
    [
      'getPersonCredits',
      {
        person_id: personData.id,
        language: lang,
      },
    ],
    personCreditsApi
  );

  return (
    <>
      {(creditsIsLoading || isLoading) && <DetailsSkeleton />}
      {creditsIsSuccess && isSuccess && (
        <>
          <PersonDetailsHeader details={details} />

          <div className={styles['person-details__biography']}>
            <h3>{t('person_details.biography')}</h3>
            {details.biography.split('\n\n').map((item, index) => (
              <p key={`biography-${index}`}>{item}</p>
            ))}
          </div>

          <div className={styles['person-details__movies']}>
            <h3>{t('person_details.filmography')}</h3>
            <div className={'details-grid'}>
              {credits.cast.map((item, index) => (
                <UiCard
                  key={index}
                  title={item.title || item.name}
                  image={item.poster_path}
                  date={`${t('movie_details.release_date')} ${new Date(item.release_date || item.first_air_date).toLocaleDateString()}`}
                  horizontal
                >
                  <ul>
                    <li>
                      {t('person_details.roles')} {item.character}
                    </li>
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
