import { applyDecorators } from "@nestjs/common"
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { RecommendationResponseDto } from "@/services/recommendations/dto/recommendation.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function RecommendationsControllerDocs() {
  return applyDecorators(
    ApiTags("Recommendations"),
  )
}

export function CreateRecommendationsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Generate movie and TV show recommendations from media items" }),
    ApiSecurity("cookie"),
    ApiCreatedResponse({ description: "Recommendations generated and new session created", type: RecommendationResponseDto }),
    ApiBadRequestResponse({ description: "Invalid recommendation input", type: ErrorResponseDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiTooManyRequestsResponse({ description: "Recommendation rate limit exceeded", type: ErrorResponseDto }),
    ApiBadGatewayResponse({ description: "AI provider failed or returned invalid output", type: ErrorResponseDto }),
  )
}

export function RefreshRecommendationsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Generate new recommendations and exclude the session history" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "New recommendations generated and added to session history", type: RecommendationResponseDto }),
    ApiBadRequestResponse({ description: "Invalid recommendation input", type: ErrorResponseDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Recommendation session not found", type: ErrorResponseDto }),
    ApiTooManyRequestsResponse({ description: "Recommendation rate limit exceeded", type: ErrorResponseDto }),
    ApiBadGatewayResponse({ description: "AI provider failed or returned invalid output", type: ErrorResponseDto }),
  )
}
