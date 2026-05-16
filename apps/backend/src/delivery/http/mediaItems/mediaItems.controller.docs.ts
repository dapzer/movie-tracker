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
import {
  MediaItemDto,
  MediaItemPaginatedDto,
  MediaItemsCountByStatusDto,
} from "@/services/mediaItems/dto/mediaItem.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaItemsControllerDocs() {
  return applyDecorators(
    ApiTags("MediaItems"),
  )
}

export function CreateMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media item" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media item created", type: MediaItemDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner of media list", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to create media item", type: ErrorResponseDto }),
  )
}

export function BulkCreateMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Bulk create media items" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media items created", type: [MediaItemDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "One or more lists not owned by user", type: ErrorResponseDto }),
  )
}

export function GetMediaItemsByUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get all media items for current user" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "User media items", type: [MediaItemDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
  )
}

export function GetMediaItemsByMediaIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media items by mediaId" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media items", type: [MediaItemDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
  )
}

export function GetMediaItemsByListIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media items by list id" }),
    ApiOkResponse({ description: "Paginated media items", type: MediaItemPaginatedDto }),
    ApiForbiddenResponse({ description: "Private list access denied", type: ErrorResponseDto }),
  )
}

export function GetMediaItemsCountByListIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media items count by list id" }),
    ApiOkResponse({ description: "Count of media items", type: MediaItemsCountByStatusDto }),
    ApiForbiddenResponse({ description: "Private list access denied", type: ErrorResponseDto }),
  )
}

export function DeleteMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media item" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Deleted media item", type: MediaItemDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner", type: ErrorResponseDto }),
  )
}

export function BulkDeleteMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Bulk delete media items" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Deleted media items", type: [MediaItemDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner of one or more items", type: ErrorResponseDto }),
  )
}

export function UpdateMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update media item" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Updated media item", type: MediaItemDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner", type: ErrorResponseDto }),
  )
}

export function CloneMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Clone media item to another list" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Cloned media item", type: MediaItemDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner of source or target list", type: ErrorResponseDto }),
  )
}

export function BulkCloneMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Bulk clone media items to lists" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Cloned media items", type: [MediaItemDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner of source items or target lists", type: ErrorResponseDto }),
  )
}
