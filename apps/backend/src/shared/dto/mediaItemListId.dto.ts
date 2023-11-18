import { IsMongoId } from 'class-validator';

export class MediaItemListIdDto {
  @IsMongoId()
  mediaListId: string;
}
