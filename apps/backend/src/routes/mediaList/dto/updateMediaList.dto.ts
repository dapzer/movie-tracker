import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { MediaListUpdateBodyType } from "@movie-tracker/types"

export class UpdateMediaListDto
  implements MediaListUpdateBodyType
{
  @IsBoolean()
  isPublic: boolean;

  @Length(3, 64)
  @IsString()
  @IsOptional()
  title: string;

  @Length(0, 256)
  @IsString()
  @IsOptional()
  description: string;
}
