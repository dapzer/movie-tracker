import { MediaDetailsInfo } from '@movie-tracker/database';
import { MediaDetailsSeasonDto } from '@/routes/mediaDetails/dto/mediaDetailsSeason.dto';

export class MediaDetailsInfoDto implements MediaDetailsInfo {
  title: string;
  originalTitle: string;
  poster: string;
  seasons: MediaDetailsSeasonDto[];
}
