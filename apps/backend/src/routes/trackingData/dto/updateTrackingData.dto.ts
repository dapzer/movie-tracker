import {
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
} from '@movie-tracker/types';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MediaItemTvProgressDto } from '@/routes/mediaItem/dto/mediaItemTvProgress.dto';
import { MediaItemSiteToViewDto } from '@/routes/mediaItem/dto/mediaItemSiteToView.dto';

export class MediaItemTrackingDataDto
  implements
    Omit<
      MediaItemTrackingDataType,
      'id' | 'createdAt' | 'updatedAt' | 'mediaItemId'
    >
{
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
}
