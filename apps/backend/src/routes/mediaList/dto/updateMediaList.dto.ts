import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { MediaListType } from '@movie-tracker/types';

export class UpdateMediaListDto
  implements Pick<MediaListType, 'title' | 'isPublic' | 'poster'>
{
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsString()
  poster: string;

  @IsOptional()
  @IsString()
  title: string;
}
