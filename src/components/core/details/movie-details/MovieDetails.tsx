import React, { FC } from 'react';
import styles from './movie-details.module.scss';
import { useQuery } from '@tanstack/react-query';
import { creditsApi, detailApi, recommendationsApi } from '../../../../api/fetchApi';
import { Credits } from '../../../../types/Credits';
import { Details } from '../../../../types/Details';
import MovieDetailsHeader from './MovieDetailsHeader';
import { ContentNames } from '../../../../types/ContentNames';
import useTranslation from 'next-translate/useTranslation';
import CastCard from '../details-cast/CastCard';
import UiModal from '../../../ui/modal/UiModal';
import { SearchResponse } from '../../../../types/SearchResponse';
import UiCard from '../../../ui/card/UiCard';
import LinkToDetails from '../link-to-details/LinkToDetails';
import InfoHeaderSkeleton from '../../../../lib/loading-skeleton/InfoHeaderSkeleton';
import DetailsInfoBlockSkeleton from '../../../../lib/loading-skeleton/DetailsInfoBlockSkeleton';
import DetailsCastSkeleton from '../../../../lib/loading-skeleton/DetailsCastSkeleton';

interface Props {
  mediaId?: number;
  mediaType: string;
  initialData?: Details.RootObject;
}

const MovieDetails: FC<Props> = ({ mediaType, mediaId, initialData }) => {
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

  const {
    data: recommendations,
    isLoading: recommendationsIsLoading,
    isSuccess: recommendationsIsSuccess,
  } = useQuery<SearchResponse.RootObject>(
    [
      'getRecommendations',
      {
        mediaId: mediaId,
        mediaType: mediaType,
        language: lang,
      },
    ],
    recommendationsApi
  );

  return (
    <div className={styles['container']}>
      {details && !isLoading ? (
        <>
          <MovieDetailsHeader details={details} mediaType={mediaType} credits={credits} />
          {details.overview && (
            <div className={styles['info_block']}>
              <h2>{t(mediaType === ContentNames.Movie ? 'movie_details.movie_description' : 'movie_details.series_description')}</h2>
              <p className={styles['text']}>{details.overview}</p>
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
      {creditsIsSuccess && (
        <>
          {credits && credits.cast.length > 0 && (
            <div className={styles['info_block']}>
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

          {recommendations && recommendations.results.length > 0 && (
            <div className={styles['info_block']}>
              <h2>{t('recommendations')}</h2>
              <div className={'details-grid'}>
                {recommendations.results.slice(0, 5).map((item) => (
                  <UiCard
                    horizontal
                    image={item.poster_path}
                    date={`${t('movie_details.release_date')} ${new Date(`${item.release_date || item.first_air_date}`).toLocaleDateString()}`}
                    link={`/details/${item.media_type}/${item.id}`}
                    key={`recommendations-${item.id}`}
                    title={item.title || item.name}
                  >
                    <LinkToDetails mediaId={item.id} mediaType={item.media_type} />
                  </UiCard>
                ))}

                {recommendations.results.length > 5 && (
                  <UiModal title={t('person_details.filmography')} btnTitle={t('full_list')} btnClass={'detail-full-cast-btn'}>
                    <div className={'details-grid'}>
                      {recommendations.results.map((item) => (
                        <UiCard
                          horizontal
                          image={item.poster_path}
                          date={`${t('movie_details.release_date')} ${new Date(`${item.release_date || item.first_air_date}`).toLocaleDateString()}`}
                          link={`/details/${item.media_type}/${item.id}`}
                          key={`recommendations-${item.id}`}
                          title={item.title || item.name}
                        >
                          <LinkToDetails mediaId={item.id} mediaType={item.media_type} />
                        </UiCard>
                      ))}
                    </div>
                  </UiModal>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieDetails;
