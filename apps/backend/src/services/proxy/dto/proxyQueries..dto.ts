import { Transform } from "class-transformer"
import { IsBoolean, IsNumber, IsOptional } from "class-validator"

export class ProxyQueriesDto {
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  size?: number

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
