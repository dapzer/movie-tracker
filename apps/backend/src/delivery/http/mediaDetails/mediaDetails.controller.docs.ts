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
import { MediaDetailsUpdateProgressDto } from "@/services/mediaDetails/dto/mediaDetailsUpdateProgress.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaDetailsControllerDocs() {
  return applyDecorators(ApiTags("MediaDetails"))
}

export function CreateOrUpdateAllMediaDetailsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Sync all media details" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({
      description: "Update progress (success and failure counts).",
      type: MediaDetailsUpdateProgressDto,
    }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Admin role required.", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Batch update failed.", type: ErrorResponseDto }),
  )
}
