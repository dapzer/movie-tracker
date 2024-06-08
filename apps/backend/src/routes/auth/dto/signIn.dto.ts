import { IsEmail, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 32)
  password: string;
}
