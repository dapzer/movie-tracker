import { MediaRatingPaginatedType } from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"
import { MediaRatingResDto } from "./MediaRating.res.dto"

export class MediaRatingPaginatedResDto implements MediaRatingPaginatedType {
  @ApiProperty({ type: MediaRatingResDto, isArray: true })
  items: MediaRatingResDto[]

  @ApiProperty({ type: Number })
  totalCount: number
}
