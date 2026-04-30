import { applyDecorators } from "@nestjs/common"
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { UserPublicDto } from "@/services/users/dto/userPublic.dto"
import { UserStatsDto } from "@/services/users/dto/userStats.dto"
import { UserWithoutPasswordDto } from "@/services/users/dto/userWithoutPassword.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function UsersControllerDocs() {
  return applyDecorators(ApiTags("Users"))
}

export function GetCurrentUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get current user" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Current user", type: UserWithoutPasswordDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
  )
}

export function GetUserByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get user by id" }),
    ApiOkResponse({ description: "Public user", type: UserPublicDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch user", type: ErrorResponseDto }),
  )
}

export function GetUserStatsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get user stats" }),
    ApiOkResponse({ description: "User stats", type: UserStatsDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch stats", type: ErrorResponseDto }),
  )
}

export function DeleteUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete user" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "User deleted", type: UserWithoutPasswordDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not allowed to delete this user", type: ErrorResponseDto }),
  )
}

export function UpdateUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update current user" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Updated user", type: UserWithoutPasswordDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to update user", type: ErrorResponseDto }),
  )
}
