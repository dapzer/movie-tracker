import { ApiProperty } from "@nestjs/swagger"
import { IsEmail } from "class-validator"

export class RequestChangeEmailDto {
  @ApiProperty({ type: String, example: "user@example.com" })
  @IsEmail()
  email: string
}
