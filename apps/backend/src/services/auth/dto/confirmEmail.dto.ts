import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class ConfirmEmailDto {
  @ApiProperty({ type: String, example: "reset-token-abc123" })
  @IsString()
  token: string
}
