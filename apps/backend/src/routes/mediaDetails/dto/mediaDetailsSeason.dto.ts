import { MediaDetailsSeason } from '@prisma/client';

export class MediaDetailsSeasonDto implements MediaDetailsSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}
