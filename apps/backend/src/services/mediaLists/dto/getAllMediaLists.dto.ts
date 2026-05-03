import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsUUID } from "class-validator"

export class GetAllMediaListsDto {
  @ApiPropertyOptional({ type: String, format: "uuid" })
  @IsOptional()
  @IsUUID()
  userId?: string
}
