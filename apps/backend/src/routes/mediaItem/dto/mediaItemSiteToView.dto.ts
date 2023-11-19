import { IsString } from 'class-validator';
import { MediaItemSiteToViewType } from '@movie-tracker/types';

export class MediaItemSiteToViewDto implements MediaItemSiteToViewType {
  @IsString()
  url: string;
}
