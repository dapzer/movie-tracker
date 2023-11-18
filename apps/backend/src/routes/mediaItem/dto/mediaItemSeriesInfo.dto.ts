import { SeriesInfo } from '@prisma/client';
import { IsInt } from 'class-validator';

export class MediaItemSeriesInfoDto implements SeriesInfo {
  @IsInt()
  currentSeason: number;

  @IsInt()
  currentEpisode: number;
}
