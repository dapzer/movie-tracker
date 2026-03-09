import { IsString } from "class-validator"

export class ConfirmChangeEmailDto {
  @IsString()
  token: string
}
