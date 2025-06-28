import { MediaListAccessLevelEnum, MediaListCreateBodyType } from "@movie-tracker/types"
import { Transform } from "class-transformer"
import { IsEnum, IsOptional, IsString, Length } from "class-validator"

export class CreateMediaListDto
implements MediaListCreateBodyType {
  @IsEnum(MediaListAccessLevelEnum)
  accessLevel: MediaListAccessLevelEnum

  @Transform(({ value }) => value?.trim())
  @Length(3, 64)
  @IsString()
  title: string

  @Length(0, 256)
  @IsString()
  @IsOptional()
  description: string
}
