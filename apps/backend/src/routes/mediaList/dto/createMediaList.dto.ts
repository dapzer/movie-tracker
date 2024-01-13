import { IsBoolean, IsString, Length } from 'class-validator';
import { MediaListType } from '@movie-tracker/types';

export class CreateMediaListDto
  implements Pick<MediaListType, 'title' | 'isPublic' | 'poster'>
{
  @IsBoolean()
  isPublic: boolean;

  @IsString()
  poster: string;

  @Length(3, 32)
  @IsString()
  title: string;
}
