import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { MediaListCreateBodyType } from '@movie-tracker/types';
import { Transform } from "class-transformer"

export class CreateMediaListDto
  implements MediaListCreateBodyType
{
  @IsBoolean()
  isPublic: boolean;

  @Transform(({ value }) => value?.trim())
  @Length(3, 64)
  @IsString()
  title: string;

  @Length(0, 256)
  @IsString()
  @IsOptional()
  description: string;
}
