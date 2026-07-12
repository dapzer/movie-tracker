import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { UserBanDto, UserBansPaginatedDto } from "@/services/userBans/dto/userBan.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

const protectedResponses = [
  ApiSecurity("cookie"),
  ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
  ApiForbiddenResponse({ description: "Insufficient permissions", type: ErrorResponseDto }),
]

export function UserBansControllerDocs() {
  return applyDecorators(ApiTags("User Bans"))
}

export function GetUserBansDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get paginated user bans" }),
    ApiOkResponse({ description: "Paginated user bans", type: UserBansPaginatedDto }),
    ...protectedResponses,
  )
}

export function GetUserBanDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get user ban by id" }),
    ApiOkResponse({ description: "User ban", type: UserBanDto }),
    ApiNotFoundResponse({ description: "User ban not found", type: ErrorResponseDto }),
    ...protectedResponses,
  )
}

export function CreateUserBanDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Ban user" }),
    ApiOkResponse({ description: "User ban created", type: UserBanDto }),
    ...protectedResponses,
  )
}

export function RevokeUserBanDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Revoke user ban" }),
    ApiOkResponse({ description: "User ban revoked", type: UserBanDto }),
    ApiNotFoundResponse({ description: "User ban not found", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "User ban already revoked", type: ErrorResponseDto }),
    ...protectedResponses,
  )
}
