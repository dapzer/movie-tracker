import React, { FC } from 'react';
import styles from './movie-details.module.scss';
import { Details } from '@/types/Details';
import { MovieDetailsHeader } from './MovieDetailsHeader';
import { ContentNames } from '@/types/Enums';
import useTranslation from 'next-translate/useTranslation';
import { CastCard } from '@/components/details-page/details-cast/CastCard';
import { UiModal } from '@/components/ui/modal/UiModal';
import { UiCard } from '@/components/ui/card/UiCard';
import { LinkToDetails } from '@/components/core/details/link-to-details/LinkToDetails';
import { InfoHeaderSkeleton } from '@/lib/loading-skeleton/InfoHeaderSkeleton';
import { DetailsInfoBlockSkeleton } from '@/lib/loading-skeleton/DetailsInfoBlockSkeleton';
import { DetailsCastSkeleton } from '@/lib/loading-skeleton/DetailsCastSkeleton';
import { useGetMovieCredits, useGetMovieDetails, useGetRecommendations, useGetVideos } from '@/hooks/useTmdbApi';
import { VideoCard } from '@/components/details-page/video-card/VideoCard';
import Masonry from 'react-masonry-css';
import { DetailsVideosSkeleton } from '@/lib/loading-skeleton/DetailsVideosSkeleton';
import { Typography } from '@/components/ui/typography/UiTypography';

interface Props {
  mediaId: number;
  mediaType: string;
  initialData?: Details.RootObject;
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export const MovieDetails: FC<Props> = ({ mediaType, mediaId, initialData }) => {
  const { t, lang } = useTranslation('details');
  const { data: details, isLoading } = useGetMovieDetails(mediaId, mediaType, lang, initialData);
  const { data: recommendations, isLoading: recommendationsIsLoading } = useGetRecommendations(mediaId, mediaType, lang);
  const { data: credits, isLoading: creditsIsLoading, isSuccess: creditsIsSuccess } = useGetMovieCredits(mediaId, mediaType, lang);
  const { data: videos, isLoading: videosIsLoading, isSuccess: videosIsSuccess } = useGetVideos(mediaId, mediaType, lang);

  return (
    <>
      {details && !isLoading ? (
        <>
          <MovieDetailsHeader details={details as Details.RootObject} mediaType={mediaType} credits={credits} />
          {details.overview && (
            <section className={styles['info_block']}>
              <Typography as="h2" variant="title2">
                {t(mediaType === ContentNames.Movie ? 'movie_details.movie_description' : 'movie_details.series_description')}
              </Typography>
              <Typography variant="text" className={styles['text']}>
                {details.overview}
              </Typography>
            </section>
          )}
        </>
      ) : (
        <>
          <InfoHeaderSkeleton />
          <DetailsInfoBlockSkeleton />
        </>
      )}

      {videosIsLoading && <DetailsVideosSkeleton />}
      {videos && !!videos.results.length && (
        <section className={styles['info_block']}>
          <Typography as="h2" variant="title2">
            {t('movie_details.videos_title')}
          </Typography>
          <div className={styles['videos_grid']}>
            {videos.results.slice(0, 3).map((el) => (
              <VideoCard
                key={el.id}
                previewUrl={`https://i.ytimg.com/vi/${el.key}/hq720.jpg`}
                videoUrl={`https://www.youtube.com/embed/${el.key}?autoplay=1`}
                title={el.name}
                releaseDate={el.published_at}
              />
            ))}

            {videos.results.length > 3 && (
              <UiModal
                title={t('movie_details.videos_title')}
                btnTitle={t('full_list')}
                btnClass={`detail-full-cast-btn ${styles['videos_showAll']}`}
              >
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="searching-results-masonry__row"
                  columnClassName="searching-results-masonry__row-column"
                >
                  {videos.results.map((el) => (
                    <VideoCard
                      key={el.id}
                      previewUrl={`https://i.ytimg.com/vi/${el.key}/hq720.jpg`}
                      videoUrl={`https://www.youtube.com/embed/${el.key}?autoplay=1`}
                      title={el.name}
                      releaseDate={el.published_at}
                    />
                  ))}
                </Masonry>
              </UiModal>
            )}
          </div>
        </section>
      )}

      {creditsIsLoading && <DetailsCastSkeleton />}
      {credits && !!credits.cast.length && (
        <section className={styles['info_block']}>
          <Typography as="h2" variant="title2">
            {t('movie_details.actors_title')}
          </Typography>
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
        </section>
      )}

      {recommendationsIsLoading && <DetailsCastSkeleton />}
      {recommendations && !!recommendations.results.length && (
        <section className={styles['info_block']}>
          <Typography as="h2" variant="title2">
            {t('recommendations')}
          </Typography>
          <div className={'details-grid'}>
            {recommendations.results.slice(0, 5).map((item) => (
              <UiCard
                horizontal
                image={item.poster_path}
                date={`${t('movie_details.release_date')} ${new Date(`${item.release_date || item.first_air_date}`).toLocaleDateString(lang)}`}
                link={`/details/${item.media_type}/${item.id}`}
                key={`recommendations-${item.id}`}
                title={item.title || item.name}
              >
                <LinkToDetails mediaId={item.id} mediaType={item.media_type} />
              </UiCard>
            ))}

            {recommendations.results.length > 5 && (
              <UiModal title={t('recommendations')} btnTitle={t('full_list')} btnClass={'detail-full-cast-btn'}>
                <div className={'details-grid'}>
                  {recommendations.results.map((item) => (
                    <UiCard
                      horizontal
                      image={item.poster_path}
                      date={`${t('movie_details.release_date')} ${new Date(`${item.release_date || item.first_air_date}`).toLocaleDateString(lang)}`}
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
        </section>
      )}
    </>
  );
};
