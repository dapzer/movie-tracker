import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";
import { UserRoleEnum, UserType } from "@movie-tracker/types";

export class UserDto implements UserType {
  @IsUUID()
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
