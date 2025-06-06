import { TmdbMediaDetailsSeasonType } from "@movie-tracker/types"

export class MediaDetailsSeasonDto implements TmdbMediaDetailsSeasonType {
  air_date: string
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string
  season_number: number
}
