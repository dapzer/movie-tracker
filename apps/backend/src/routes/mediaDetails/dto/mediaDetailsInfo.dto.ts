import { MediaDetailsInfo } from '@prisma/client';
import { MediaDetailsSeasonDto } from '@/routes/mediaDetails/dto/mediaDetailsSeason.dto';

export class MediaDetailsInfoDto implements MediaDetailsInfo {
  title: string;
  originalTitle: string;
  poster: string;
  seasons: MediaDetailsSeasonDto[];
}
