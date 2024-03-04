import { MediaItemType } from '@movie-tracker/types';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateMediaItemDto
  implements Partial<Pick<MediaItemType, 'mediaDetailsId' | 'mediaListId'>>
{
  @IsOptional()
  @IsUUID()
  mediaListId?: string;

  @IsOptional()
  @IsUUID()
  mediaDetailsId?: string;
}
