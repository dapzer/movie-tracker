import { createZodDto } from "nestjs-zod"
import { UserDto } from "./user.dto"

export class UserWithoutPasswordDto extends createZodDto(UserDto.schema.omit({ password: true })) {}
