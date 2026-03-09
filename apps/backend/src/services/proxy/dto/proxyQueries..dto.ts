import { Transform } from "class-transformer"
import { IsBoolean, IsOptional, IsString } from "class-validator"

export class ProxyQueriesDto {
  @IsOptional()
  @IsString()
  size?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true")
      return true
    if (value === "false")
      return false
    return value
  })
  keepOriginalType?: boolean
}
