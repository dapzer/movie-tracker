import { MediaItemType } from "@movie-tracker/types"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsUUID } from "class-validator"

export class UpdateMediaItemDto
implements Partial<Pick<MediaItemType, "mediaDetailsId" | "mediaListId">> {
  @ApiPropertyOptional({ type: String, format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" })
  @IsOptional()
  @IsUUID()
  mediaListId?: string

  @ApiPropertyOptional({ type: String, format: "uuid", example: "f6b49f5d-2c8a-4f3e-9e74-7a3f7d2d5a01" })
  @IsOptional()
  @IsUUID()
  mediaDetailsId?: string
}
