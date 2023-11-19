import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MediaItemSeriesInfoDto } from '@/routes/mediaItem/dto/mediaItemSeriesInfo.dto';
import { MediaItemSiteToViewDto } from '@/routes/mediaItem/dto/mediaItemSiteToView.dto';
import { Type } from 'class-transformer';
import {
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
} from '@movie-tracker/types';

export class MediaItemTrackingDataDto implements MediaItemTrackingDataType {
  @IsEnum(MediaItemStatusNameEnum)
  currentStatus: MediaItemStatusNameEnum;

  @IsString()
  note: string;

  @IsOptional()
  @IsNumber()
  score: number | null;

  @ValidateNested()
  @Type(() => MediaItemSeriesInfoDto)
  seriesInfo: MediaItemSeriesInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemSiteToViewDto)
  sitesToView: Array<MediaItemSiteToViewDto>;
}
