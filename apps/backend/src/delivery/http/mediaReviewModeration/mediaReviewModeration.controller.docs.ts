import { applyDecorators } from "@nestjs/common"
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { MediaReviewModerationLogDto } from "@/services/mediaReviewModeration/dto/mediaReviewModerationLog.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaReviewModerationControllerDocs() {
  return applyDecorators(ApiTags("MediaReviewModeration"))
}

export function GetModerationLogsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get moderation logs by media review id" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Moderation logs", type: [MediaReviewModerationLogDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Insufficient permissions", type: ErrorResponseDto }),
  )
}

export function ModerateMediaReviewDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Moderate media review" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Moderation log created", type: MediaReviewModerationLogDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Insufficient permissions", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media review not found", type: ErrorResponseDto }),
  )
}
