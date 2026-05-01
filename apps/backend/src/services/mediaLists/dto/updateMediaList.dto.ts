import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaListAccessLevelEnum,
  MediaListUpdateBodyType,
} from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEnum, IsOptional, IsString, Length } from "class-validator"

export class UpdateMediaListDto implements MediaListUpdateBodyType {
  @ApiProperty({ enum: MediaListAccessLevelEnum, example: MediaListAccessLevelEnum.PUBLIC })
  @IsEnum(MediaListAccessLevelEnum)
  accessLevel: MediaListAccessLevelEnum

  @ApiPropertyOptional({ type: String, example: "My favorite anime list" })
  @Transform(({ value }) => value?.trim() ?? null)
  @Length(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT)
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({ type: String, example: "List of shows I plan to watch" })
  @Length(0, 256)
  @IsString()
  @IsOptional()
  description?: string
}
