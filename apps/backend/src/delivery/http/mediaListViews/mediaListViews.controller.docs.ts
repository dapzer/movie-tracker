import { applyDecorators } from "@nestjs/common"
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"

import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaListViewsControllerDocs() {
  return applyDecorators(
    ApiTags("MediaListViews"),
  )
}

export function SendMediaListViewDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Send media list view" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "View recorded" }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({
      description: "Failed to record media list view",
      type: ErrorResponseDto,
    }),
  )
}
