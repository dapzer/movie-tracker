import { MediaDetailsInfoDto } from '@/routes/mediaDetails/dto/mediaDetailsInfo.dto';
import { MediaDetailsMovieType } from '@movie-tracker/types';

export const convertMediaDetailsToMediaDetailsInfo = (
  details: MediaDetailsMovieType,
): MediaDetailsInfoDto => {
  return {
    originalTitle: details?.original_title || details?.original_name,
    title: details?.title || details?.name,
    poster: details?.poster_path,
    seasons: details?.seasons,
  };
};
