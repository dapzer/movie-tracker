import { MediaDetailsInfoDto } from '@/routes/mediaDetails/dto/mediaDetailsInfo.dto';
import { MediaDetailsType, MediaTypeEnum } from '@movie-tracker/types';

export class MediaDetailsDto implements MediaDetailsType {
  id: string;
  mediaId: number;
  mediaType: MediaTypeEnum;
  score: number;
  en: MediaDetailsInfoDto;
  ru: MediaDetailsInfoDto;
  createdAt: Date;
  updatedAt: Date;
}
