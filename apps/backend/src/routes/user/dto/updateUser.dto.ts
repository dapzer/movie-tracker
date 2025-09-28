import { UserMediaRatingsAccessLevelEnum } from "@movie-tracker/types"
import { IsEnum, IsOptional, IsString, IsUrl, Length } from "class-validator"
import { UserDto } from "@/routes/auth/dto/user.dto"

export class UpdateUserDto implements Partial<Pick<UserDto, "name" | "image" | "mediaRatingsAccessLevel">> {
  @IsOptional()
  @IsString()
  @Length(1, 32)
  name?: string

  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string

  @IsOptional()
  @IsEnum(UserMediaRatingsAccessLevelEnum)
  mediaRatingsAccessLevel?: UserMediaRatingsAccessLevelEnum
}
