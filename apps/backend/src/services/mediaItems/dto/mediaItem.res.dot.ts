import {
  MediaItemsByListIdResponseType,
  MediaItemsCountByStatusType,
  MediaItemSiteToViewType,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemTvProgressType,
  MediaItemType,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { MediaDetailsResDto } from "@/services/mediaDetails/dto/mediaDetails.res.dto"
import { MediaRatingResDto } from "@/services/mediaRatings/dto/mediaRating.res.dto"

export class MediaItemTvProgressDto implements MediaItemTvProgressType {
  @ApiProperty({ type: Number, example: 1 })
  currentSeason: number

  @ApiProperty({ type: Number, example: 3 })
  currentEpisode: number
}

export class MediaItemSiteToViewDto implements MediaItemSiteToViewType {
  @ApiProperty({ type: String, example: "https://netflix.com/watch/123" })
  url: string
}

export class MediaItemTrackingDataDto implements MediaItemTrackingDataType {
  @ApiProperty({ type: String, format: "uuid" })
  id: string

  @ApiProperty({ type: String, format: "uuid" })
  mediaItemId: string

  @ApiProperty({ enum: MediaItemStatusNameEnum })
  currentStatus: MediaItemStatusNameEnum

  @ApiProperty({ type: String, maxLength: 2500 })
  note: string

  @ApiPropertyOptional({ type: Number, nullable: true, example: 8 })
  score: number | null

  @ApiProperty({ type: MediaItemTvProgressDto })
  tvProgress: MediaItemTvProgressDto

  @ApiProperty({ type: [MediaItemSiteToViewDto] })
  sitesToView: MediaItemSiteToViewDto[]

  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date

  @ApiProperty({ type: String, format: "date-time" })
  updatedAt: Date
}

export class MediaItemResDto implements MediaItemType {
  @ApiProperty({ type: String, format: "uuid" })
  id: string

  @ApiProperty({ type: Number, example: 550 })
  mediaId: number

  @ApiProperty({ type: String, format: "uuid" })
  mediaDetailsId: string

  @ApiProperty({ type: String, format: "uuid" })
  mediaListId: string

  @ApiProperty({ enum: MediaTypeEnum })
  mediaType: MediaTypeEnum

  @ApiPropertyOptional({ type: MediaDetailsResDto })
  mediaDetails?: MediaDetailsResDto

  @ApiPropertyOptional({ type: MediaRatingResDto })
  mediaRating?: MediaRatingResDto

  @ApiProperty({ type: MediaItemTrackingDataDto })
  trackingData: MediaItemTrackingDataDto

  @ApiProperty({ type: String, format: "date-time" })
  createdAt: Date

  @ApiProperty({ type: String, format: "date-time" })
  updatedAt: Date
}

export class MediaItemPaginatedResDto implements MediaItemsByListIdResponseType {
  @ApiProperty({ type: [MediaItemResDto] })
  items: MediaItemResDto[]

  @ApiProperty({ type: Number, example: 42 })
  totalCount: number
}

export class MediaItemsCountByStatusResDto implements MediaItemsCountByStatusType {
  @ApiProperty({ type: Number, example: 5 })
  [MediaItemStatusNameEnum.WATCHING_NOW]: number

  @ApiProperty({ type: Number, example: 12 })
  [MediaItemStatusNameEnum.NOT_VIEWED]: number

  @ApiProperty({ type: Number, example: 3 })
  [MediaItemStatusNameEnum.WAIT_NEW_PART]: number

  @ApiProperty({ type: Number, example: 20 })
  [MediaItemStatusNameEnum.VIEWED]: number

  @ApiProperty({ type: Number, example: 40 })
  total: number
}
