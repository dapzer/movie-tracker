import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { TrackingDataBulkResponseDto, TrackingDataResponseDto } from "@/services/trackingData/dto/trackingDataResponse.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function TrackingDataControllerDocs() {
  return applyDecorators(ApiTags("Tracking Data"))
}

export function UpdateTrackingDataDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update tracking data" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Tracking data updated successfully", type: TrackingDataResponseDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Invalid request", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to update tracking data", type: ErrorResponseDto }),
  )
}

export function UpdateBulkTrackingDataDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Bulk update tracking data" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Tracking data bulk updated successfully", type: TrackingDataBulkResponseDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Invalid request", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to bulk update tracking data", type: ErrorResponseDto }),
  )
}
