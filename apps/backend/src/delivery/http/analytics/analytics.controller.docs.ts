import { applyDecorators } from "@nestjs/common"
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger"
import { AnalyticsRecordsDto } from "@/services/analytics/dto/analyticsRecords.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function AnalyticsControllerDocs() {
  return applyDecorators(ApiTags("Analytics"))
}

export function GetRecordsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get analytics records" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({
      description: "Analytics records retrieved successfully",
      type: AnalyticsRecordsDto,
    }),
    ApiForbiddenResponse({ description: "Insufficient permissions", type: ErrorResponseDto }),
  )
}
