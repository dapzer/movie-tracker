import React, { FC } from 'react';
import { Person } from '../../../types/Person';
import PersonDetailsHeader from './PersonDetailsHeader';
import styles from './person-details.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { ContentNames } from '../../../types/Enums';
import CreditsCard from '../details-cast/CreditsCard';
import UiModal from '../../ui/modal/UiModal';
import InfoHeaderSkeleton from '../../../lib/loading-skeleton/InfoHeaderSkeleton';
import DetailsInfoBlockSkeleton from '../../../lib/loading-skeleton/DetailsInfoBlockSkeleton';
import DetailsCastSkeleton from '../../../lib/loading-skeleton/DetailsCastSkeleton';
import { useGetPersonCredits, useGetPersonDetails } from '../../../hooks/useTmdbApi';

interface Props {
  personId: number;
  initialData?: Person.RootObject;
}

const PersonDetails: FC<Props> = ({ personId, initialData }) => {
  const { t, lang } = useTranslation('details');
  const { data: details, isLoading } = useGetPersonDetails(personId, ContentNames.Person, lang, initialData);
  const {
    data: credits,
    isLoading: creditsIsLoading,
    isSuccess: creditsIsSuccess,
  } = useGetPersonCredits(personId, lang);

  return (
    <>
      {details && !isLoading ? (
        <>
          <PersonDetailsHeader details={details as Person.RootObject} />

          {details.biography && (
            <div className={styles['biography']}>
              <h3>{t('person_details.biography')}</h3>
              {details.biography.split('\n\n').map((item, index) => (
                <p key={`biography-${index}`}>{item}</p>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <InfoHeaderSkeleton />
          <DetailsInfoBlockSkeleton />
        </>
      )}

      {creditsIsLoading && <DetailsCastSkeleton />}
      {creditsIsSuccess && credits && (
        <>
          {credits.cast.length > 0 && (
            <div className={styles['movies']}>
              <h3>{t('person_details.filmography')}</h3>
              <div className={'details-grid'}>
                {credits.cast.slice(0, 5).map((item) => (
                  <CreditsCard key={`credit-${item.id}`} item={item} />
                ))}
                {credits.cast.length > 5 && (
                  <UiModal title={t('person_details.filmography')} btnTitle={t('full_list')}
                           btnClass={'detail-full-cast-btn'}>
                    <div className={'details-grid'}>
                      {credits.cast.map((item) => (
                        <CreditsCard key={`credit-list-${item.id}`} item={item} />
                      ))}
                    </div>
                  </UiModal>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PersonDetails;
