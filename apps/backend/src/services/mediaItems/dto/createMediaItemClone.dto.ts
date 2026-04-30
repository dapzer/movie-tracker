import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsUUID } from "class-validator"

export class CreateMediaItemCloneDto {
  @ApiProperty({ type: String, format: "uuid", example: "b10c5d0d-4ce2-4e31-8d1a-7d1a0b944b3a" })
  @IsUUID()
  mediaListId: string

  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  isSaveCreationDate: boolean
}
