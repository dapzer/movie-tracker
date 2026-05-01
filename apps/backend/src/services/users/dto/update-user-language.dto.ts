import { LanguagesEnum } from "@movie-tracker/types"
import { IsEnum, IsOptional } from "class-validator"

export class UpdateUserLanguageDto {
  @IsOptional()
  @IsEnum(LanguagesEnum)
  language?: LanguagesEnum
}
