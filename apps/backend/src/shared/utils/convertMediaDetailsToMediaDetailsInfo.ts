import { DetailsType } from '@/shared/dto/DetailsType';
import { MediaDetailsInfoDto } from '@/routes/mediaDetails/dto/mediaDetailsInfo.dto';

export const convertMediaDetailsToMediaDetailsInfo = (
  details: DetailsType.RootObject,
): MediaDetailsInfoDto => {
  return {
    originalTitle: details?.original_title || details?.original_name,
    title: details?.title || details?.name,
    poster: details?.poster_path,
    seasons: details?.seasons,
  };
};
