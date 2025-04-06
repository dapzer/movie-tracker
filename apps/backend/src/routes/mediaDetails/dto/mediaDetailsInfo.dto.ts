import { MediaDetailsSeasonDto } from "@/routes/mediaDetails/dto/mediaDetailsSeason.dto"
import { MediaDetailsInfoType } from "@movie-tracker/types"

export class MediaDetailsInfoDto implements MediaDetailsInfoType {
  title: string
  originalTitle: string
  poster: string
  seasons?: MediaDetailsSeasonDto[]
}
