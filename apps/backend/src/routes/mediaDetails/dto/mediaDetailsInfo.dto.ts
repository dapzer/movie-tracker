import { MediaDetailsInfoType } from "@movie-tracker/types"
import { MediaDetailsSeasonDto } from "@/routes/mediaDetails/dto/mediaDetailsSeason.dto"

export class MediaDetailsInfoDto implements MediaDetailsInfoType {
  title: string
  originalTitle: string
  poster: string
  seasons?: MediaDetailsSeasonDto[]
  status?: string
}
