import { IsInt } from 'class-validator';
import { MediaItemSeriesInfoType } from '@movie-tracker/types';

export class MediaItemSeriesInfoDto implements MediaItemSeriesInfoType {
  @IsInt()
  currentSeason: number;

  @IsInt()
  currentEpisode: number;
}
