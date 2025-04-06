import { MediaListUpdateBodyType } from "@movie-tracker/types"
import { Transform } from "class-transformer"
import { IsBoolean, IsOptional, IsString, Length } from "class-validator"

export class UpdateMediaListDto
implements MediaListUpdateBodyType {
  @IsBoolean()
  isPublic: boolean

  @Transform(({ value }) => value?.trim())
  @Length(3, 64)
  @IsString()
  @IsOptional()
  title: string

  @Length(0, 256)
  @IsString()
  @IsOptional()
  description: string
}
