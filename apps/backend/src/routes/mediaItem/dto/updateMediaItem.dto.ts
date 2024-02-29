import { MediaItemType } from '@movie-tracker/types';

export class UpdateMediaItemDto
  implements Pick<MediaItemType, 'mediaDetailsId' | 'mediaListId'>
{
  mediaListId: string;
  mediaDetailsId: string;
}
