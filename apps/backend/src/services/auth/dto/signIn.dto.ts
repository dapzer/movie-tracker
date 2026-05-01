import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Length } from "class-validator"

export class SignInDto {
  @ApiProperty({ type: String, example: "user@example.com" })
  @IsEmail()
  email: string

  @ApiProperty({ type: String, example: "StrongPass123" })
  @IsString()
  @Length(8, 32)
  password: string
}
