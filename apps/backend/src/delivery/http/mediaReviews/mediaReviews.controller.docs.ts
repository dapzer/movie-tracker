import { applyDecorators } from "@nestjs/common"
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import {
  MediaReviewDislikeDto,
  MediaReviewDto,
  MediaReviewLikeDto,
  MediaReviewPaginatedDto,
} from "@/services/mediaReviews/dto/mediaReview.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaReviewsControllerDocs() {
  return applyDecorators(ApiTags("MediaReviews"))
}

export function GetMediaReviewsListDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media reviews list" }),
    ApiOkResponse({ description: "Paginated media reviews list", type: MediaReviewPaginatedDto }),
    ApiForbiddenResponse({ description: "Permission denied", type: ErrorResponseDto }),
  )
}

export function GetMediaReviewByCurrentUserAndMediaIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get current user media review by media id" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Current user media review", type: MediaReviewDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
  )
}

export function GetMediaReviewByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media review by id" }),
    ApiOkResponse({ description: "Media review", type: MediaReviewDto }),
    ApiNotFoundResponse({ description: "Media review not found", type: ErrorResponseDto }),
  )
}

export function GetMediaReviewsByMediaIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media reviews by media id" }),
    ApiOkResponse({ description: "Paginated media reviews", type: MediaReviewPaginatedDto }),
  )
}

export function GetMediaReviewsByUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media reviews by user id" }),
    ApiOkResponse({ description: "Paginated media reviews", type: MediaReviewPaginatedDto }),
    ApiForbiddenResponse({ description: "Permission denied", type: ErrorResponseDto }),
  )
}

export function CreateMediaReviewDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media review" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media review created", type: MediaReviewDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiConflictResponse({ description: "Media review already exists", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Media details couldn't be created", type: ErrorResponseDto }),
  )
}

export function UpdateMediaReviewDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update media review" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Updated media review", type: MediaReviewDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media review not found", type: ErrorResponseDto }),
  )
}

export function DeleteMediaReviewDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media review" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Deleted media review", type: MediaReviewDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media review not found", type: ErrorResponseDto }),
  )
}

export function GetMediaReviewLikesDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media review likes" }),
    ApiOkResponse({ description: "Media review likes", type: [MediaReviewLikeDto] }),
  )
}

export function CreateMediaReviewLikeDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media review like" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media review like created", type: MediaReviewLikeDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media review not found", type: ErrorResponseDto }),
    ApiConflictResponse({ description: "Media review like already exists", type: ErrorResponseDto }),
  )
}

export function DeleteMediaReviewLikeDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media review like" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media review like deleted", type: MediaReviewLikeDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media review like not found", type: ErrorResponseDto }),
  )
}

export function GetMediaReviewDislikesDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media review dislikes" }),
    ApiOkResponse({ description: "Media review dislikes", type: [MediaReviewDislikeDto] }),
  )
}

export function CreateMediaReviewDislikeDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media review dislike" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media review dislike created", type: MediaReviewDislikeDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media review not found", type: ErrorResponseDto }),
    ApiConflictResponse({ description: "Media review dislike already exists", type: ErrorResponseDto }),
  )
}

export function DeleteMediaReviewDislikeDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media review dislike" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media review dislike deleted", type: MediaReviewDislikeDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media review dislike not found", type: ErrorResponseDto }),
  )
}
