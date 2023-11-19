import { SiteToView } from '@movie-tracker/database';
import { IsString } from 'class-validator';

export class MediaItemSiteToViewDto implements SiteToView {
  @IsString()
  url: string;
}
