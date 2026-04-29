import { applyDecorators } from "@nestjs/common"
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { CreateMediaRatingDto } from "@/services/mediaRatings/dto/createMediaRating.dto"
import { MediaRatingResDto } from "@/services/mediaRatings/dto/mediaRating.res.dto"
import { MediaRatingPaginatedResDto } from "@/services/mediaRatings/dto/mediaRatingPaginated.res.dto"
import { UpdateMediaRatingDto } from "@/services/mediaRatings/dto/updateMediaRating.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaRatingsControllerDocs() {
  return applyDecorators(ApiTags("Media Ratings"))
}

export function GetRecentlyCreatedMediaRatingsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get recently created media ratings" }),
    ApiQuery({ name: "limit", required: false, type: Number }),
    ApiQuery({ name: "offset", required: false, type: Number }),
    ApiOkResponse({ description: "Recently created media ratings", type: MediaRatingPaginatedResDto }),
  )
}

export function GetMediaRatingByCurrentUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media rating for current user by media id" }),
    ApiSecurity("oauth2"),
    ApiParam({ name: "mediaId", type: Number }),
    ApiOkResponse({ description: "Media rating for current user", type: MediaRatingResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media rating not found", type: ErrorResponseDto }),
  )
}

export function GetMediaRatingsByUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media ratings by user id" }),
    ApiParam({ name: "id", type: String, format: "uuid" }),
    ApiQuery({ name: "limit", required: false, type: Number }),
    ApiQuery({ name: "offset", required: false, type: Number }),
    ApiOkResponse({ description: "Media ratings for user", type: MediaRatingPaginatedResDto }),
    ApiForbiddenResponse({ description: "Permission denied", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "User not found", type: ErrorResponseDto }),
  )
}

export function CreateMediaRatingDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media rating" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: CreateMediaRatingDto }),
    ApiOkResponse({ description: "Media rating created", type: MediaRatingResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Media details couldn't be created.", type: ErrorResponseDto }),
  )
}

export function UpdateMediaRatingDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update media rating" }),
    ApiSecurity("oauth2"),
    ApiParam({ name: "id", type: String, format: "uuid" }),
    ApiBody({ type: UpdateMediaRatingDto }),
    ApiOkResponse({ description: "Media rating updated", type: MediaRatingResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media rating not found", type: ErrorResponseDto }),
  )
}

export function DeleteMediaRatingDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media rating" }),
    ApiSecurity("oauth2"),
    ApiParam({ name: "id", type: String, format: "uuid" }),
    ApiOkResponse({ description: "Media rating deleted", type: MediaRatingResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media rating not found", type: ErrorResponseDto }),
  )
}
