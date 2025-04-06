import { IsEmail } from "class-validator"

export class RequestChangeEmailDto {
  @IsEmail()
  email: string
}
