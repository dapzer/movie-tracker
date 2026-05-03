import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class GetMedialListByIdDto {
  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  id: string
}
