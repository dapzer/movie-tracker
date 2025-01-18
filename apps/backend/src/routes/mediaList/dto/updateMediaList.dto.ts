import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { MediaListType } from '@movie-tracker/types';

export class UpdateMediaListDto
  implements Pick<MediaListType, 'title' | 'isPublic' | 'poster'>
{
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @Length(3, 32)
  @IsString()
  title: string;
}
