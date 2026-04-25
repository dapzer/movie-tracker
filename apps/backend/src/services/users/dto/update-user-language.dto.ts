import { LanguagesEnum } from "@movie-tracker/types"
import { IsEnum, IsOptional, IsString } from "class-validator"

export class UpdateUserLanguageDto {
  @IsString()
  @IsOptional()
  @IsEnum(LanguagesEnum)
  language?: LanguagesEnum
}
