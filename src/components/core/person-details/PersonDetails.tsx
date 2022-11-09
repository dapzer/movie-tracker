import React, { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Person } from '../../../types/Person';
import { detailApi, personCreditsApi } from '../../../api/fetchApi';
import PersonDetailsHeader from './PersonDetailsHeader';
import styles from './person-details.module.scss';
import UiCard from '../../ui/card/UiCard';
import useTranslation from 'next-translate/useTranslation';
import DetailsSkeleton from '../../../lib/loading-skeleton/DetailsSkeleton';
import { ContentNames } from '../../../types/ContentNames';
import LinkToDetails from '../link-to-details/LinkToDetails';

interface Props {
  personId: number;
  initialData?: Person.RootObject;
}

const PersonDetails: FC<Props> = ({ personId, initialData }) => {
  const { t, lang } = useTranslation('details');

  const {
    data: details,
    isSuccess,
    isLoading,
  } = useQuery<Person.RootObject>({
    queryKey: [
      'getDetails',
      {
        mediaId: personId,
        mediaType: ContentNames.Person,
        language: lang,
      },
    ],
    queryFn: detailApi,
    initialData: initialData,
  });

  const {
    data: credits,
    isSuccess: creditsIsSuccess,
    isLoading: creditsIsLoading,
  } = useQuery<Person.Credits>(
    [
      'getPersonCredits',
      {
        person_id: personId,
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

          {details.biography && (
            <div className={styles['person-details__biography']}>
              <h3>{t('person_details.biography')}</h3>
              {details.biography.split('\n\n').map((item, index) => (
                <p key={`biography-${index}`}>{item}</p>
              ))}
            </div>
          )}

          {credits.cast.length > 0 && (
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
                    link={`/details/${item.media_type}/${item.id}`}
                  >
                    <ul>
                      <li>
                        {t('person_details.roles')} {item.character}
                      </li>
                    </ul>

                    <LinkToDetails mediaId={item.id} mediaType={item.media_type} />
                  </UiCard>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PersonDetails;
