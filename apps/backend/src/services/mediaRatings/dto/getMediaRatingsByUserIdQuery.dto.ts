import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class GetMediaRatingsByUserIdQueryDto {
  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  userId: string
}
