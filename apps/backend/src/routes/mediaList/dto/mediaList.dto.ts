import { MediaList } from '@prisma/client';
import { IsBoolean, IsDateString, IsMongoId, IsString } from 'class-validator';

export class MediaListDto implements MediaList {
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
