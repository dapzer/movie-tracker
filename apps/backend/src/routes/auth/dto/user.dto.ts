import { User, UserRoleEnum } from 'database';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UserDto implements User {
  @IsMongoId()
  id: string;

  // @IsOptional()
  // @IsString()
  // userName: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsEnum(UserRoleEnum, { each: true })
  roles: UserRoleEnum[];

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
