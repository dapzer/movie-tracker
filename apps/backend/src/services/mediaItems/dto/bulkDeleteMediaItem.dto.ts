import { ApiProperty } from "@nestjs/swagger"
import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator"

export class BulkDeleteMediaItemDto {
  @ApiProperty({
    type: [String],
    format: "uuid",
    example: ["a23d2b67-8a7e-4f70-9c8b-0a8f7a53c021"],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID(undefined, { each: true })
  ids: string[]
}
