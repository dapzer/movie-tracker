import { Transform } from "class-transformer"
import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator"

export class GetOpenGraphImageDto {
  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl: string

  @IsString()
  title?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true")
      return true
    if (value === "false")
      return false
    return value
  })
  isAvatarPlaceholder?: boolean
}
