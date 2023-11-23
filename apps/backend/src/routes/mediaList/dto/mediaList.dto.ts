import { IsBoolean, IsDateString, IsMongoId, IsString } from 'class-validator';
import { MediaListType } from '@movie-tracker/types';

export class MediaListDto implements MediaListType {
  @IsMongoId()
  id: string;

  @IsMongoId()
  userId: string;

  @IsBoolean()
  isSystem: boolean;

  @IsBoolean()
  isPublic: boolean;

  @IsString()
  title: string;

  @IsString()
  poster: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
