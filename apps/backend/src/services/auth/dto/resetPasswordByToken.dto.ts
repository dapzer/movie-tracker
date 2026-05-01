import { ApiProperty } from "@nestjs/swagger"
import { IsString, Length } from "class-validator"

export class ResetPasswordByTokenDto {
  @ApiProperty({ type: String, example: "reset-token-abc123" })
  @IsString()
  token: string

  @ApiProperty({ type: String, example: "NewStrongPass123" })
  @IsString()
  @Length(8, 32)
  password: string
}
