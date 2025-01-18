import { IsBoolean, IsString, Length } from 'class-validator';
import { MediaListType } from '@movie-tracker/types';

export class CreateMediaListDto
  implements Pick<MediaListType, 'title' | 'isPublic'>
{
  @IsBoolean()
  isPublic: boolean;

  @Length(3, 32)
  @IsString()
  title: string;
}
