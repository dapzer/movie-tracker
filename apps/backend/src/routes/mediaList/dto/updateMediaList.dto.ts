import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaListAccessLevelEnum,
  MediaListUpdateBodyType,
} from "@movie-tracker/types"
import { Transform } from "class-transformer"
import { IsEnum, IsOptional, IsString, Length } from "class-validator"

export class UpdateMediaListDto
implements MediaListUpdateBodyType {
  @IsEnum(MediaListAccessLevelEnum)
  accessLevel: MediaListAccessLevelEnum

  @Transform(({ value }) => value?.trim() ?? null)
  @Length(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT)
  @IsString()
  @IsOptional()
  title: string

  @Length(0, 256)
  @IsString()
  @IsOptional()
  description: string
}
