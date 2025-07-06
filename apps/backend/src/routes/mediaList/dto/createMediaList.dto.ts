import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaListAccessLevelEnum,
  MediaListCreateBodyType,
} from "@movie-tracker/types"
import { Transform } from "class-transformer"
import { IsEnum, IsOptional, IsString, Length } from "class-validator"

export class CreateMediaListDto
implements MediaListCreateBodyType {
  @IsEnum(MediaListAccessLevelEnum)
  accessLevel: MediaListAccessLevelEnum

  @Transform(({ value }) => value?.trim())
  @Length(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT)
  @IsString()
  title: string

  @Length(0, 256)
  @IsString()
  @IsOptional()
  description: string
}
