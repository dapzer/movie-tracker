import {
  MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
} from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator"
import { MediaItemSiteToViewDto } from "@/services/mediaItems/dto/mediaItemSiteToView.dto"
import { MediaItemTvProgressDto } from "@/services/mediaItems/dto/mediaItemTvProgress.dto"

export class UpdateTrackingDataDto
implements
    Omit<
      MediaItemTrackingDataType,
      "id" | "createdAt" | "updatedAt" | "mediaItemId"
    > {
  @ApiProperty({
    enum: MediaItemStatusNameEnum,
    example: MediaItemStatusNameEnum.WATCHING_NOW,
  })
  @IsEnum(MediaItemStatusNameEnum)
  currentStatus: MediaItemStatusNameEnum

  @ApiProperty({
    type: String,
    example: "Great pacing, strong character development",
    maxLength: MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH,
  })
  @IsString()
  @MaxLength(MEDIA_ITEM_TRACKING_NOTE_MAX_LENGTH)
  note: string

  @ApiPropertyOptional({ type: Number, example: 8.5, nullable: true })
  @IsOptional()
  @IsNumber()
  score: number | null

  @ApiProperty({ type: () => MediaItemTvProgressDto })
  @ValidateNested()
  @Type(() => MediaItemTvProgressDto)
  tvProgress: MediaItemTvProgressDto

  @ApiProperty({ type: () => [MediaItemSiteToViewDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemSiteToViewDto)
  sitesToView: Array<MediaItemSiteToViewDto>
}
