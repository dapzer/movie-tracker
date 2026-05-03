import { OmitType } from "@nestjs/swagger"
import { UserDto } from "./user.dto"

export class UserWithoutPasswordDto extends OmitType(UserDto, ["password"] as const) {}
