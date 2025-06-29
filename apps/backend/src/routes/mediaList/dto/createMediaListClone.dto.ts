import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT,
  MediaItemStatusNameEnum,
} from "@movie-tracker/types"
import { Transform } from "class-transformer"
import { IsArray, IsBoolean, IsEnum, IsString, Length } from "class-validator"

export class CreateMediaListCloneDto {
  @IsArray()
  @IsEnum(MediaItemStatusNameEnum, { each: true })
  selectedStatuses: MediaItemStatusNameEnum[]

  @IsBoolean()
  isKeepStatus: boolean

  @Transform(({ value }) => value?.trim())
  @IsString()
  @Length(MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT, MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT)
  title: string
}
