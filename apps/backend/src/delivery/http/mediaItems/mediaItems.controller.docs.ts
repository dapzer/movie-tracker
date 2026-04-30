import { applyDecorators } from "@nestjs/common"
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger"
import { BulkCreateMediaItemDto } from "@/services/mediaItems/dto/bulkCreateMediaItem.dto"
import { BulkDeleteMediaItemDto } from "@/services/mediaItems/dto/bulkDeleteMediaItem.dto"
import { CreateMediaItemDto } from "@/services/mediaItems/dto/createMediaItem.dto"
import { CreateMediaItemCloneDto } from "@/services/mediaItems/dto/createMediaItemClone.dto"
import {
  MediaItemPaginatedResDto,
  MediaItemResDto,
  MediaItemsCountByStatusResDto,
} from "@/services/mediaItems/dto/mediaItem.res.dot"
import { UpdateMediaItemDto } from "@/services/mediaItems/dto/updateMediaItem.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaItemsControllerDocs() {
  return applyDecorators(
    ApiTags("MediaItems"),
  )
}

export function CreateMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media item" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: CreateMediaItemDto }),
    ApiOkResponse({ description: "Media item created", type: MediaItemResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner of media list", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to create media item", type: ErrorResponseDto }),
  )
}

export function BulkCreateMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Bulk create media items" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: BulkCreateMediaItemDto }),
    ApiOkResponse({ description: "Media items created", type: [MediaItemResDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "One or more lists not owned by user", type: ErrorResponseDto }),
  )
}

export function GetMediaItemsByUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get all media items for current user" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "User media items", type: [MediaItemResDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
  )
}

export function GetMediaItemsByMediaIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media items by mediaId" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Media items", type: [MediaItemResDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
  )
}

export function GetMediaItemsByListIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media items by list id" }),
    ApiOkResponse({ description: "Paginated media items", type: MediaItemPaginatedResDto }),
    ApiForbiddenResponse({ description: "Private list access denied", type: ErrorResponseDto }),
  )
}

export function GetMediaItemsCountByListIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media items count by list id" }),
    ApiOkResponse({ description: "Count of media items", type: MediaItemsCountByStatusResDto }),
    ApiForbiddenResponse({ description: "Private list access denied", type: ErrorResponseDto }),
  )
}

export function DeleteMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media item" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Deleted media item", type: MediaItemResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner", type: ErrorResponseDto }),
  )
}

export function BulkDeleteMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Bulk delete media items" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: BulkDeleteMediaItemDto }),
    ApiOkResponse({ description: "Deleted media items", type: [MediaItemResDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner of one or more items", type: ErrorResponseDto }),
  )
}

export function UpdateMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update media item" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: UpdateMediaItemDto }),
    ApiOkResponse({ description: "Updated media item", type: MediaItemResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner", type: ErrorResponseDto }),
  )
}

export function CloneMediaItemDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Clone media item to another list" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: CreateMediaItemCloneDto }),
    ApiOkResponse({ description: "Cloned media item", type: MediaItemResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner of source or target list", type: ErrorResponseDto }),
  )
}
