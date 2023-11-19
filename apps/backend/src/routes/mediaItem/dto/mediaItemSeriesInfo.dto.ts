import { SeriesInfo } from 'database';
import { IsInt } from 'class-validator';

export class MediaItemSeriesInfoDto implements SeriesInfo {
  @IsInt()
  currentSeason: number;

  @IsInt()
  currentEpisode: number;
}
