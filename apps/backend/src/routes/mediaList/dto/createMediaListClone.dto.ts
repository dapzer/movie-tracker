import { MediaItemStatusNameEnum } from "@movie-tracker/types"
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
  @Length(3, 64)
  title: string
}
