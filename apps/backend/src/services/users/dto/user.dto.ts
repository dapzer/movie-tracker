import {
  SignUpMethodEnum,
  UserMediaRatingsAccessLevelEnum,
  UserRoleEnum,
  UserType,
} from "@movie-tracker/types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
} from "class-validator"

export class UserDto implements UserType {
  @ApiProperty({ type: String, format: "uuid", example: "c1a9b6e2-3f4d-4a7c-9d2e-123456789abc" })
  @IsUUID()
  id: string

  // @IsOptional()
  // @IsString()
  // userName: string;

  @ApiProperty({ type: String, example: "John Doe" })
  @IsString()
  name: string

  @ApiPropertyOptional({ type: String, example: "user@example.com" })
  @IsOptional()
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty({ type: String, example: "https://cdn.example.com/avatar.jpg" })
  @IsUrl()
  @IsString()
  image: string

  @ApiPropertyOptional({ type: String, minLength: 8, maxLength: 32, example: "StrongPass123" })
  @IsOptional()
  @IsString()
  @Length(8, 32)
  password?: string

  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  isEmailVerified: boolean

  @ApiProperty({ enum: UserRoleEnum, isArray: true, example: [UserRoleEnum.USER] })
  @IsEnum(UserRoleEnum, { each: true })
  roles: UserRoleEnum[]

  @ApiProperty({ enum: SignUpMethodEnum, example: SignUpMethodEnum.EMAIL })
  @IsEnum(SignUpMethodEnum)
  signUpMethod: SignUpMethodEnum

  @ApiPropertyOptional({ enum: UserMediaRatingsAccessLevelEnum, example: UserMediaRatingsAccessLevelEnum.PUBLIC })
  @IsOptional()
  @IsEnum(UserMediaRatingsAccessLevelEnum)
  mediaRatingsAccessLevel?: UserMediaRatingsAccessLevelEnum

  @ApiProperty({ type: String, format: "date-time", example: "2024-01-01T12:00:00.000Z" })
  @IsDateString()
  createdAt: Date

  @ApiProperty({ type: String, format: "date-time", example: "2024-01-02T12:00:00.000Z" })
  @IsDateString()
  updatedAt: Date
}
