import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator"

export class GetOpenGraphImageDto {
  @ApiPropertyOptional({ type: String, example: "https://cdn.example.com/image.jpg" })
  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl: string

  @ApiPropertyOptional({ type: String, example: "My awesome media list" })
  @IsString()
  title?: string

  @ApiPropertyOptional({ type: Boolean, example: true })
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
