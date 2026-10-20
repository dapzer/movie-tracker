import { applyDecorators } from "@nestjs/common"
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { TvEpisodeWatchDto } from "@/services/tvEpisodeWatches/dto/tvEpisodeWatch.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function TvEpisodeWatchesControllerDocs() {
  return applyDecorators(ApiTags("TvEpisodeWatches"))
}

export function GetTvEpisodeWatchesByCycleIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get TV episode watches by watch cycle id (owner only)" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "TV episode watches for watch cycle", type: [TvEpisodeWatchDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "TV watch cycle not found", type: ErrorResponseDto }),
  )
}

export function CreateTvEpisodeWatchDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Mark TV episode as watched" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "TV episode watch", type: TvEpisodeWatchDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "TV watch cycle not found", type: ErrorResponseDto }),
    ApiConflictResponse({ description: "Episode is already marked as watched in this cycle or the cycle is finished", type: ErrorResponseDto }),
  )
}

export function BulkCreateTvEpisodeWatchDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Mark multiple TV episodes as watched" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "TV episode watches of the cycle", type: [TvEpisodeWatchDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "TV watch cycle not found", type: ErrorResponseDto }),
    ApiConflictResponse({ description: "One of the episodes is already marked as watched in this cycle or the cycle is finished", type: ErrorResponseDto }),
  )
}

export function DeleteTvEpisodeWatchDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Unmark TV episode (delete episode watch)" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Deleted TV episode watch", type: TvEpisodeWatchDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized.", type: ErrorResponseDto }),
    ApiNotFoundResponse({ description: "TV episode watch not found", type: ErrorResponseDto }),
    ApiConflictResponse({ description: "The watch cycle is finished", type: ErrorResponseDto }),
  )
}
