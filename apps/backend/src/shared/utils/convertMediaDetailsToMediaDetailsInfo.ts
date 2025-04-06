import { MediaDetailsInfoDto } from "@/routes/mediaDetails/dto/mediaDetailsInfo.dto"
import { TmdbMediaDetailsType } from "@movie-tracker/types"

export function convertMediaDetailsToMediaDetailsInfo(details: TmdbMediaDetailsType): MediaDetailsInfoDto {
  return {
    originalTitle: details?.original_title || details?.original_name,
    title: details?.title || details?.name,
    poster: details?.poster_path,
    seasons: details?.seasons,
  }
}
