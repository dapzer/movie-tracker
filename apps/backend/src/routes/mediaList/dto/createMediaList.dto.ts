import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { MediaListCreateBodyType } from '@movie-tracker/types';

export class CreateMediaListDto
  implements MediaListCreateBodyType
{
  @IsBoolean()
  isPublic: boolean;

  @Length(3, 64)
  @IsString()
  title: string;

  @Length(0, 256)
  @IsString()
  @IsOptional()
  description: string;
}
