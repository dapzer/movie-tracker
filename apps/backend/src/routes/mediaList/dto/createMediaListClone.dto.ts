import { IsArray, IsBoolean, IsEnum, IsString, Length } from 'class-validator';
import { MediaItemStatusNameEnum } from '@movie-tracker/types';

export class CreateMediaListCloneDto {
  @IsArray()
  @IsEnum(MediaItemStatusNameEnum, { each: true })
  selectedStatuses: MediaItemStatusNameEnum[];

  @IsBoolean()
  isKeepStatus: boolean;

  @IsString()
  @Length(3, 32)
  title: string;
}
