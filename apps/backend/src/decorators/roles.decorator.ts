import { UserRoleEnum } from "@movie-tracker/types"
import { Reflector } from "@nestjs/core"

export const Roles = Reflector.createDecorator<UserRoleEnum[]>()
