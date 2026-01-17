import { MediaDetailsInfoSeasonType, MediaDetailsInfoType } from "@movie-tracker/types"
import { TmdbDetailsWithSeasonsResponseType } from "@/api/tmdb/tmdbApiTypes"

export function convertMediaDetailsToMediaDetailsInfo(data: TmdbDetailsWithSeasonsResponseType): MediaDetailsInfoType {
  return {
    originalTitle: data.details?.original_title || data.details?.original_name,
    title: data.details?.title || data.details?.name,
    poster: data.details?.poster_path,
    seasons: getSeasons(data),
    status: data.details?.status,
    releaseDate: data.details?.release_date || data.details?.first_air_date,
  }
}

function getSeasons(data: TmdbDetailsWithSeasonsResponseType): MediaDetailsInfoSeasonType[] {
  return data.details?.seasons?.map((el) => {
    return {
      airDate: el.air_date,
      episodeCount: el.episode_count,
      name: el.name,
      episodes: data.seasons
        .find(season => season.season_number === el.season_number)
        ?.episodes
        .map((ep) => {
          return {
            airDate: ep.air_date,
            episodeNumber: ep.episode_number,
            name: ep.name,
            seasonNumber: ep.season_number,
          }
        }) || [],
      seasonNumber: el.season_number,
    }
  })
}
