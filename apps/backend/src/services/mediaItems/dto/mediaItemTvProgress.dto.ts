import { MediaItemTvProgressType } from "@movie-tracker/types"
import { IsInt } from "class-validator"

export class MediaItemTvProgressDto implements MediaItemTvProgressType {
  @IsInt()
  currentSeason: number

  @IsInt()
  currentEpisode: number
}
