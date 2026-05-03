import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaItemStatusNameEnum,
} from "@movie-tracker/types"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsBoolean, IsEnum, IsString, Length } from "class-validator"

export class CreateMediaListCloneDto {
  @ApiProperty({
    type: [String],
    enum: MediaItemStatusNameEnum,
    isArray: true,
    example: [
      MediaItemStatusNameEnum.WATCHING_NOW,
      MediaItemStatusNameEnum.VIEWED,
    ],
  })
  @IsArray()
  @IsEnum(MediaItemStatusNameEnum, { each: true })
  selectedStatuses: MediaItemStatusNameEnum[]

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  isKeepStatus: boolean

  @ApiProperty({
    type: String,
    minLength: MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
    maxLength: MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
    example: "Cloned Anime List",
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT)
  title: string
}
