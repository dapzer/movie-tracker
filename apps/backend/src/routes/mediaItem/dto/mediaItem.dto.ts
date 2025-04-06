import { MediaItemTrackingDataDto } from "@/routes/mediaItem/dto/mediaItemTrackingDataDto.dto"
import { MediaItemType, MediaTypeEnum } from "@movie-tracker/types"
import { Type } from "class-transformer"
import { IsDateString, IsEnum, IsNumber, IsUUID, ValidateNested } from "class-validator"

export class MediaItemDto implements MediaItemType {
  @IsUUID()
  id: string

  @IsUUID()
  mediaDetailsId: string

  @IsNumber()
  mediaId: number

  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum

  @IsUUID()
  mediaListId: string

  @ValidateNested()
  @Type(() => MediaItemTrackingDataDto)
  trackingData: MediaItemTrackingDataDto

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date
}
