import { SiteToView } from '@prisma/client';
import { IsString } from 'class-validator';

export class MediaItemSiteToViewDto implements SiteToView {
  @IsString()
  url: string;
}
