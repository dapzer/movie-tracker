import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { UserFollowDto } from "@/services/userFollows/dto/userFollow.dto"
import { UserFollowInformationDto } from "@/services/userFollows/dto/userFollowInformation.dto"
import { UserFollowPaginatedDto } from "@/services/userFollows/dto/userFollowPaginated.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function UserFollowsControllerDocs() {
  return applyDecorators(ApiTags("User Follows"))
}

export function GetUserFollowInformationDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get user follow information" }),
    ApiOkResponse({ description: "Follow information", type: UserFollowInformationDto }),
    ApiNotFoundResponse({ description: "User not found", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch follow information", type: ErrorResponseDto }),
  )
}

export function GetUserFollowersDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get user followers" }),
    ApiOkResponse({ description: "User followers", type: UserFollowPaginatedDto }),
    ApiNotFoundResponse({ description: "User not found", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch followers", type: ErrorResponseDto }),
  )
}

export function GetUserFollowingsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get user followings" }),
    ApiOkResponse({ description: "User followings", type: UserFollowPaginatedDto }),
    ApiNotFoundResponse({ description: "User not found", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch followings", type: ErrorResponseDto }),
  )
}

export function CreateUserFollowDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Follow user" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "User followed", type: UserFollowDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Users cannot follow themselves", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "User not found", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Cannot follow this user", type: ErrorResponseDto }),
  )
}

export function DeleteUserFollowDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Unfollow user" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "User unfollowed", type: UserFollowDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Users cannot unfollow themselves", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "User or follow relationship not found", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Cannot unfollow this user", type: ErrorResponseDto }),
  )
}
