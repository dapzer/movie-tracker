import { IsInt } from 'class-validator';
import { MediaItemTvProgressType } from '@movie-tracker/types';

export class MediaItemTvProgressDto implements MediaItemTvProgressType {
  @IsInt()
  currentSeason: number;

  @IsInt()
  currentEpisode: number;
}
