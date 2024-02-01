import {
  IsArray, IsDate, IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString, IsUUID,
  ValidateNested
} from "class-validator";
import { MediaItemSiteToViewDto } from '@/routes/mediaItem/dto/mediaItemSiteToView.dto';
import { Type } from 'class-transformer';
import {
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
} from '@movie-tracker/types';
import { MediaItemTvProgressDto } from "@/routes/mediaItem/dto/mediaItemTvProgress.dto";

export class MediaItemTrackingDataDto implements MediaItemTrackingDataType {
  @IsUUID()
  id: string;

  @IsUUID()
  mediaItemId: string;

  @IsEnum(MediaItemStatusNameEnum)
  currentStatus: MediaItemStatusNameEnum;

  @IsString()
  note: string;

  @IsOptional()
  @IsNumber()
  score: number | null;

  @ValidateNested()
  @Type(() => MediaItemTvProgressDto)
  tvProgress: MediaItemTvProgressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemSiteToViewDto)
  sitesToView: Array<MediaItemSiteToViewDto>;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
