import { Person } from '@/types/Person';
import { PersonDetailsHeader } from './PersonDetailsHeader';
import styles from './person-details.module.scss';
import useTranslation from 'next-translate/useTranslation';
import { ContentNames } from '@/types/Enums';
import { CreditsCard } from '@/components/details-page/details-cast/CreditsCard';
import { UiModal } from '@/components/ui/modal/UiModal';
import { InfoHeaderSkeleton } from '@/lib/loading-skeleton/InfoHeaderSkeleton';
import { DetailsInfoBlockSkeleton } from '@/lib/loading-skeleton/DetailsInfoBlockSkeleton';
import { DetailsCastSkeleton } from '@/lib/loading-skeleton/DetailsCastSkeleton';
import { useGetPersonCredits, useGetPersonDetails } from '@/hooks/useTmdbApi';
import { Typography } from '@/components/ui/typography/UiTypography';

interface PersonDetailsProps {
  personId: number;
  initialData?: Person.RootObject;
}

export const PersonDetails = (props: PersonDetailsProps) => {
  const { personId, initialData } = props;
  const { t, lang } = useTranslation('details');
  const { data: details, isLoading } = useGetPersonDetails(personId, ContentNames.Person, lang, initialData);
  const { data: credits, isLoading: creditsIsLoading, isSuccess: creditsIsSuccess } = useGetPersonCredits(personId, lang);

  return (
    <>
      {details && !isLoading ? (
        <>
          <PersonDetailsHeader details={details as Person.RootObject} />

          {details.biography && (
            <section className={styles['biography']}>
              <Typography as="h2" variant="title2">
                {t('person_details.biography')}
              </Typography>
              {details.biography.split('\n\n').map((item, index) => (
                <Typography key={`biography-${index}`}>{item}</Typography>
              ))}
            </section>
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
          {!!credits.cast.length && (
            <section className={styles['movies']}>
              <Typography as="h2" variant="title2">
                {t('person_details.filmography')}
              </Typography>
              <div className={'details-grid'}>
                {credits.cast.slice(0, 5).map((item) => (
                  <CreditsCard key={`credit-${item.id}`} item={item} />
                ))}
                {credits.cast.length > 5 && (
                  <UiModal title={t('person_details.filmography')} btnTitle={t('full_list')} btnClass={'detail-full-cast-btn'}>
                    <div className={'details-grid'}>
                      {credits.cast.map((item) => (
                        <CreditsCard key={`credit-list-${item.id}`} item={item} />
                      ))}
                    </div>
                  </UiModal>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};