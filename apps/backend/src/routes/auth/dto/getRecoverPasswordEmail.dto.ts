import { IsEmail } from "class-validator"

export class GetRecoverPasswordEmailDto {
  @IsEmail()
  email: string
}
