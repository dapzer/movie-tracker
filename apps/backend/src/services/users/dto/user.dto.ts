import { SignUpMethodEnum, UserMediaRatingsAccessLevelEnum, UserRoleEnum, UserType } from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsUrl, IsUUID, Length } from "class-validator"

export class UserDto implements UserType {
  @ApiProperty({ type: String, format: "uuid" })
  @IsUUID()
  id: string

  // @IsOptional()
  // @IsString()
  // userName: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty({ type: String })
  @IsUrl()
  @IsString()
  image: string

  @ApiPropertyOptional({ type: String, minLength: 8, maxLength: 32 })
  @IsOptional()
  @IsString()
  @Length(8, 32)
  password?: string

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isEmailVerified: boolean

  @ApiProperty({ enum: UserRoleEnum, isArray: true })
  @IsEnum(UserRoleEnum, { each: true })
  roles: UserRoleEnum[]

  @ApiProperty({ enum: SignUpMethodEnum })
  @IsEnum(SignUpMethodEnum)
  signUpMethod: SignUpMethodEnum

  @ApiPropertyOptional({ enum: UserMediaRatingsAccessLevelEnum })
  @IsOptional()
  @IsEnum(UserMediaRatingsAccessLevelEnum)
  mediaRatingsAccessLevel?: UserMediaRatingsAccessLevelEnum

  @ApiProperty({ type: String, format: "date-time" })
  @IsDateString()
  createdAt: Date

  @ApiProperty({ type: String, format: "date-time" })
  @IsDateString()
  updatedAt: Date
}
