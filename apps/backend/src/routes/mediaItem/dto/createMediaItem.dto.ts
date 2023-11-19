import { MediaTypeEnum } from '@movie-tracker/database';
import { IsEnum, IsMongoId, IsNumber } from 'class-validator';

export class CreateMediaItemDto {
  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum;

  @IsNumber()
  mediaId: number;

  @IsMongoId()
  mediaListId: string;
}
