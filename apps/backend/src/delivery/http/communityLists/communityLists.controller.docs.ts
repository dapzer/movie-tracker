import { applyDecorators } from "@nestjs/common"
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"

import { MediaListsPaginatedDto } from "@/services/mediaLists/dto/mediaList.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function CommunityListsControllerDocs() {
  return applyDecorators(
    ApiTags("Community Lists"),
  )
}

export function SearchCommunityListsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Search community lists" }),
    ApiOkResponse({ description: "Search results", type: MediaListsPaginatedDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Search failed", type: ErrorResponseDto }),
  )
}

export function GetWeekTopCommunityListsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get weekly top community lists" }),
    ApiOkResponse({ description: "Weekly top lists", type: MediaListsPaginatedDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch weekly top lists", type: ErrorResponseDto }),
  )
}

export function GetAllTimeTopCommunityListsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get all-time top community lists" }),
    ApiOkResponse({ description: "All-time top lists", type: MediaListsPaginatedDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch all-time top lists", type: ErrorResponseDto }),
  )
}

export function GetNewestCommunityListsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get newest community lists" }),
    ApiOkResponse({ description: "Newest lists", type: MediaListsPaginatedDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch newest lists", type: ErrorResponseDto }),
  )
}

export function GetCommunityListsWithMediaDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get community lists containing media" }),
    ApiOkResponse({ description: "Lists with media", type: MediaListsPaginatedDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch lists with media", type: ErrorResponseDto }),
  )
}
