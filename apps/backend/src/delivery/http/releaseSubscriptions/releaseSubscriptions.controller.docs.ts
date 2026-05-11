import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import {
  ReleaseSubscriptionDto,
  ReleaseSubscriptionsResponseDto,
  ReleaseSubscriptionWithDetailsDto,
} from "@/services/releaseSubscriptions/dto/releaseSubscription.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function ReleaseSubscriptionsControllerDocs() {
  return applyDecorators(ApiTags("Release Subscriptions"))
}

export function CreateReleaseSubscriptionDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create release subscription" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Release subscription created", type: ReleaseSubscriptionWithDetailsDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Invalid request", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to create release subscription", type: ErrorResponseDto }),
  )
}

export function GetReleaseSubscriptionsByUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get user release subscriptions" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Release subscriptions list", type: ReleaseSubscriptionsResponseDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch release subscriptions", type: ErrorResponseDto }),
  )
}

export function GetReleaseSubscriptionByMediaIdAndUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get release subscription by media ID" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Release subscription", type: ReleaseSubscriptionWithDetailsDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Release subscription not found", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch release subscription", type: ErrorResponseDto }),
  )
}

export function DeleteReleaseSubscriptionDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete release subscription" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Release subscription deleted", type: ReleaseSubscriptionDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Release subscription not found", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to delete release subscription", type: ErrorResponseDto }),
  )
}
