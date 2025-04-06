import { MediaItemSiteToViewDto } from "@/routes/mediaItem/dto/mediaItemSiteToView.dto"
import { MediaItemTvProgressDto } from "@/routes/mediaItem/dto/mediaItemTvProgress.dto"
import {
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
} from "@movie-tracker/types"
import { Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

export class MediaItemTrackingDataDto
implements
    Omit<
      MediaItemTrackingDataType,
      "id" | "createdAt" | "updatedAt" | "mediaItemId"
    > {
  @IsEnum(MediaItemStatusNameEnum)
  currentStatus: MediaItemStatusNameEnum

  @IsString()
  note: string

  @IsOptional()
  @IsNumber()
  score: number | null

  @ValidateNested()
  @Type(() => MediaItemTvProgressDto)
  tvProgress: MediaItemTvProgressDto

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemSiteToViewDto)
  sitesToView: Array<MediaItemSiteToViewDto>
}
