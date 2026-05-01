import { applyDecorators } from "@nestjs/common"
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { MediaRatingDto } from "@/services/mediaRatings/dto/mediaRating.dto"
import { MediaRatingPaginatedDto } from "@/services/mediaRatings/dto/mediaRatingPaginated.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaRatingsControllerDocs() {
  return applyDecorators(ApiTags("MediaRatings"))
}

export function GetRecentlyCreatedMediaRatingsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get recently created media ratings" }),
    ApiOkResponse({ description: "Recently created media ratings", type: MediaRatingPaginatedDto }),
  )
}

export function GetMediaRatingByCurrentUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media rating for current user by media id" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Media rating for current user", type: MediaRatingDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media rating not found", type: ErrorResponseDto }),
  )
}

export function GetMediaRatingsByUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media ratings by user id" }),
    ApiOkResponse({ description: "Media ratings for user", type: MediaRatingPaginatedDto }),
    ApiForbiddenResponse({ description: "Permission denied", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "User not found", type: ErrorResponseDto }),
  )
}

export function CreateMediaRatingDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media rating" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Media rating created", type: MediaRatingDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Media details couldn't be created.", type: ErrorResponseDto }),
  )
}

export function UpdateMediaRatingDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update media rating" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Media rating updated", type: MediaRatingDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media rating not found", type: ErrorResponseDto }),
  )
}

export function DeleteMediaRatingDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media rating" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Media rating deleted", type: MediaRatingDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media rating not found", type: ErrorResponseDto }),
  )
}
