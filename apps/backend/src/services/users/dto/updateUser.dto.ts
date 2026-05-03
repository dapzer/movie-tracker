import { UserMediaRatingsAccessLevelEnum } from "@movie-tracker/types"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString, IsUrl, Length } from "class-validator"
import { UserDto } from "@/services/users/dto/user.dto"

export class UpdateUserDto implements Partial<Pick<UserDto, "name" | "image" | "mediaRatingsAccessLevel">> {
  @ApiPropertyOptional({ type: String, example: "John Doe" })
  @IsOptional()
  @IsString()
  @Length(1, 32)
  name?: string

  @ApiPropertyOptional({ type: String, example: "https://cdn.example.com/avatar.jpg" })
  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string

  @ApiPropertyOptional({
    enum: UserMediaRatingsAccessLevelEnum,
    example: UserMediaRatingsAccessLevelEnum.PUBLIC,
  })
  @IsOptional()
  @IsEnum(UserMediaRatingsAccessLevelEnum)
  mediaRatingsAccessLevel?: UserMediaRatingsAccessLevelEnum
}
