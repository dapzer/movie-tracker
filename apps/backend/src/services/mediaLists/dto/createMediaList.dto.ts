import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaListAccessLevelEnum,
  MediaListCreateBodyType,
} from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEnum, IsOptional, IsString, Length } from "class-validator"

export class CreateMediaListDto implements MediaListCreateBodyType {
  @ApiProperty({
    enum: MediaListAccessLevelEnum,
    example: MediaListAccessLevelEnum.PRIVATE,
  })
  @IsEnum(MediaListAccessLevelEnum)
  accessLevel: MediaListAccessLevelEnum

  @ApiProperty({
    type: String,
    minLength: MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
    maxLength: MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
    example: "My Anime Watchlist",
  })
  @Transform(({ value }) => value?.trim())
  @Length(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT)
  @IsString()
  title: string

  @ApiPropertyOptional({
    type: String,
    maxLength: 256,
    example: "Anime I want to finish in 2026",
  })
  @Length(0, 256)
  @IsString()
  @IsOptional()
  description: string
}
