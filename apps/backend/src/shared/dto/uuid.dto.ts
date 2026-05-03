import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class UuidDto {
  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  id: string
}
