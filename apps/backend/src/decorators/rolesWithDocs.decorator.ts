import { UserRoleEnum } from "@movie-tracker/types"
import { applyDecorators } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"
import { Roles } from "./roles.decorator"

export function RolesWithDocs(roles: UserRoleEnum[]) {
  return applyDecorators(
    Roles(roles),
    ApiOperation({
      description: `Requires roles: ${roles.join(", ")}`,
    }),
  )
}
