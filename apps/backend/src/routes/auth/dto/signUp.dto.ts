import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 32)
  password: string;

  @IsString()
  @Length(1, 32)
  name: string;

  @IsString()
  @IsOptional()
  image?: string;
}
