import { IsString, Length } from 'class-validator';

export class RecoverPasswordByTokenDto {
  @IsString()
  token: string;

  @IsString()
  @Length(8, 32)
  password: string;
}
