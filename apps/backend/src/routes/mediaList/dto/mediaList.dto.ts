import { IsBoolean, IsDateString, IsString, IsUUID } from "class-validator";
import { MediaListType } from "@movie-tracker/types";

export class MediaListDto implements MediaListType {
  @IsUUID()
  id: string;

  @IsUUID()
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
