import React, { FC } from 'react';
import styles from './movie-details.module.scss';
import { Details } from '../../../../types/Details';
import MovieDetailsHeader from './MovieDetailsHeader';
import { ContentNames } from '../../../../types/ContentNames';
import useTranslation from 'next-translate/useTranslation';
import CastCard from '../details-cast/CastCard';
import UiModal from '../../../ui/modal/UiModal';
import UiCard from '../../../ui/card/UiCard';
import LinkToDetails from '../link-to-details/LinkToDetails';
import InfoHeaderSkeleton from '../../../../lib/loading-skeleton/InfoHeaderSkeleton';
import DetailsInfoBlockSkeleton from '../../../../lib/loading-skeleton/DetailsInfoBlockSkeleton';
import DetailsCastSkeleton from '../../../../lib/loading-skeleton/DetailsCastSkeleton';
import { useGetMovieCredits, useGetMovieDetails, useGetRecommendations } from '../../../../hooks/useTmdbApi';

interface Props {
  mediaId?: number;
  mediaType: string;
  initialData?: Details.RootObject;
}

const MovieDetails: FC<Props> = ({ mediaType, mediaId, initialData }) => {
  const { t, lang } = useTranslation('details');
  const { data: details, isLoading } = useGetMovieDetails(mediaId!, mediaType, lang, initialData);
  const {
    data: credits,
    isLoading: creditsIsLoading,
    isSuccess: creditsIsSuccess,
  } = useGetMovieCredits(mediaId!, mediaType, lang);
  const { data: recommendations } = useGetRecommendations(mediaId!, mediaType, lang);

  return (
    <div className={styles['container']}>
      {details && !isLoading ? (
        <>
          <MovieDetailsHeader details={details as Details.RootObject} mediaType={mediaType} credits={credits} />
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
                  <UiModal title={t('movie_details.actors_title')} btnTitle={t('full_list')}
                           btnClass={'detail-full-cast-btn'}>
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
                  <UiModal title={t('person_details.filmography')} btnTitle={t('full_list')}
                           btnClass={'detail-full-cast-btn'}>
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
