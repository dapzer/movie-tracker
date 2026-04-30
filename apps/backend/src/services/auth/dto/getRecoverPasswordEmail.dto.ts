import { ApiProperty } from "@nestjs/swagger"
import { IsEmail } from "class-validator"

export class GetRecoverPasswordEmailDto {
  @ApiProperty({ type: String, example: "user@example.com" })
  @IsEmail()
  email: string
}
