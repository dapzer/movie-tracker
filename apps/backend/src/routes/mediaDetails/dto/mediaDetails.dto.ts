import { MediaDetails } from 'database';
import { MediaDetailsInfoDto } from '@/routes/mediaDetails/dto/mediaDetailsInfo.dto';

export class MediaDetailsDto implements MediaDetails {
  id: string;
  mediaId: number;
  mediaType: MediaDetails['mediaType'];
  score: number;
  en: MediaDetailsInfoDto;
  ru: MediaDetailsInfoDto;
  createdAt: Date;
  updatedAt: Date;
}
