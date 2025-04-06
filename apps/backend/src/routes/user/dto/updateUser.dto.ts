import { UserDto } from "@/routes/auth/dto/user.dto"
import { IsOptional, IsString, IsUrl, Length } from "class-validator"

export class UpdateUserDto implements Partial<Pick<UserDto, "name" | "image">> {
  @IsOptional()
  @IsString()
  @Length(1, 32)
  name?: string

  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string
}
