import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsUUID } from "class-validator"

export class GetAllMediaListsDto {
  @ApiProperty({ type: String, format: "uuid" })
  @IsOptional()
  @IsUUID()
  userId: string
}
