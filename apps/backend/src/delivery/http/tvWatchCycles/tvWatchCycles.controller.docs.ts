import { applyDecorators } from "@nestjs/common"
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from "@nestjs/swagger"
import { TvWatchCycleDto, TvWatchCycleWithEpisodesDto } from "@/services/tvWatchCycles/dto/tvWatchCycle.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function TvWatchCyclesControllerDocs() {
  return applyDecorators(ApiTags("TvWatchCycles"))
}

export function GetTvWatchCyclesByMediaItemIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get TV watch cycles by media item id (owner only)" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "TV watch cycles for media item", type: [TvWatchCycleDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media item not found", type: ErrorResponseDto }),
  )
}

export function GetActiveTvWatchCycleByMediaItemIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get active TV watch cycle with episode watches by media item id (owner only)" }),
    ApiSecurity("cookie"),
    ApiExtraModels(TvWatchCycleWithEpisodesDto),
    ApiOkResponse({
      description: "Active TV watch cycle with episode watches (null when there is no active cycle)",
      schema: {
        anyOf: [
          { $ref: getSchemaPath(TvWatchCycleWithEpisodesDto) },
          { type: "null" },
        ],
      },
    }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media item not found", type: ErrorResponseDto }),
  )
}

export function StartTvWatchCycleDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Start new TV watch cycle (finishes the currently active one)" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Newly created TV watch cycle", type: TvWatchCycleDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "Media item not found", type: ErrorResponseDto }),
    ApiBadRequestResponse({ description: "Media item is not a TV show", type: ErrorResponseDto }),
  )
}
