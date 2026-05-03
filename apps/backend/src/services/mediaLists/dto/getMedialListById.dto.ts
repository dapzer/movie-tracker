import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class GetMedialListByIdDto {
  @ApiProperty({ type: String, format: "uuid ot cuid" })
  @IsString()
  id: string
}
