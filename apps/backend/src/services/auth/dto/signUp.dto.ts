import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Length } from "class-validator"

export class SignUpDto {
  @ApiProperty({ type: String, example: "user@example.com" })
  @IsEmail()
  email: string

  @ApiProperty({ type: String, example: "StrongPass123" })
  @IsString()
  @Length(8, 32)
  password: string

  @ApiProperty({ type: String, example: "John Doe" })
  @IsString()
  @Length(1, 32)
  name: string
}
