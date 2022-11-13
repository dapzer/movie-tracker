import React, { FC } from 'react';
import styles from './details.module.scss';
import { useQuery } from '@tanstack/react-query';
import { creditsApi, detailApi } from '../../../api/fetchApi';
import { Credits } from '../../../types/Credits';
import { Details } from '../../../types/Details';
import DetailsHeader from './DetailsHeader';
import { ContentNames } from '../../../types/ContentNames';
import useTranslation from 'next-translate/useTranslation';
import DetailsSkeleton from '../../../lib/loading-skeleton/DetailsSkeleton';
import CastCard from '../details-cast/CastCard';
import UiModal from '../../ui/modal/UiModal';

interface Props {
  mediaId?: number;
  mediaType?: string;
  initialData?: Details.RootObject;
}

const Details: FC<Props> = ({ mediaType, mediaId, initialData }) => {
  const { t, lang } = useTranslation('details');

  const {
    data: details,
    isLoading,
    isSuccess,
  } = useQuery<Details.RootObject>({
    queryKey: [
      'getDetails',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    queryFn: detailApi,
    initialData: initialData,
  });

  const {
    data: credits,
    isLoading: creditsIsLoading,
    isSuccess: creditsIsSuccess,
  } = useQuery<Credits.RootObject>(
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
      {(creditsIsLoading || isLoading) && <DetailsSkeleton />}
      {creditsIsSuccess && isSuccess && (
        <div className={styles['details']}>
          <DetailsHeader details={details} credits={credits} mediaType={mediaType} />

          {details.overview && (
            <div className={styles['details__about']}>
              <h2>{t(mediaType === ContentNames.Movie ? 'movie_details.movie_description' : 'movie_details.series_description')}</h2>
              <p>{details.overview}</p>
            </div>
          )}

          {credits && credits.cast.length > 0 && (
            <div className={styles['details__about']}>
              <h2>{t('movie_details.actors_title')}</h2>
              <div className={'details-grid'}>
                {credits.cast.slice(0, 5).map((item) => (
                  <CastCard key={`person-${item.id}`} item={item} />
                ))}
                {credits.cast.length > 5 && (
                  <UiModal title={t('movie_details.actors_title')} btnTitle={t('full_list')} btnClass={'detail-full-cast-btn'}>
                    <div className={'details-grid'}>
                      {credits.cast.map((item) => (
                        <CastCard key={`person-list-${item.id}`} item={item} />
                      ))}
                    </div>
                  </UiModal>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Details;
