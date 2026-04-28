import { applyDecorators } from "@nestjs/common"
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger"
import { CreateMediaRatingDto } from "@/services/mediaRatings/dto/createMediaRating.dto"
import { MediaRatingResDto } from "@/services/mediaRatings/dto/MediaRating.res.dto"
import { MediaRatingPaginatedResDto } from "@/services/mediaRatings/dto/MediaRatingPaginated.res.dto"
import { UpdateMediaRatingDto } from "@/services/mediaRatings/dto/updateMediaRating.dto"

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
    ApiParam({ name: "mediaId", type: Number }),
    ApiOkResponse({ description: "Media rating for current user", type: MediaRatingResDto }),
  )
}

export function GetMediaRatingsByUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media ratings by user id" }),
    ApiParam({ name: "id", type: String, format: "uuid" }),
    ApiQuery({ name: "limit", required: false, type: Number }),
    ApiQuery({ name: "offset", required: false, type: Number }),
    ApiOkResponse({ description: "Media ratings for user", type: MediaRatingPaginatedResDto }),
  )
}

export function CreateMediaRatingDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media rating" }),
    ApiBody({ type: CreateMediaRatingDto }),
    ApiOkResponse({ description: "Media rating created", type: MediaRatingResDto }),
  )
}

export function UpdateMediaRatingDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update media rating" }),
    ApiParam({ name: "id", type: String, format: "uuid" }),
    ApiBody({ type: UpdateMediaRatingDto }),
    ApiOkResponse({ description: "Media rating updated", type: MediaRatingResDto }),
  )
}

export function DeleteMediaRatingDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media rating" }),
    ApiParam({ name: "id", type: String, format: "uuid" }),
    ApiOkResponse({ description: "Media rating deleted", type: MediaRatingResDto }),
  )
}
