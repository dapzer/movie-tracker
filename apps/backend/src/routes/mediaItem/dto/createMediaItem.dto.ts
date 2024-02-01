import { MediaTypeEnum } from '@movie-tracker/types';
import { IsEnum, IsNumber, IsUUID } from "class-validator";

export class CreateMediaItemDto {
  @IsEnum(MediaTypeEnum)
  mediaType: MediaTypeEnum;

  @IsNumber()
  mediaId: number;

  @IsUUID()
  mediaListId: string;
}
