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

import { MediaListDto } from "@/services/mediaLists/dto/mediaList.dto"
import { MediaListLikeDto } from "@/services/mediaLists/dto/mediaListLike.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaListsControllerDocs() {
  return applyDecorators(
    ApiTags("MediaLists"),
  )
}

export function GetMediaListsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media lists" }),
    ApiOkResponse({ description: "Media lists", type: [MediaListDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch media lists", type: ErrorResponseDto }),
  )
}

export function GetMediaListByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media list by id" }),
    ApiOkResponse({ description: "Media list", type: MediaListDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Private list access denied", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch media list", type: ErrorResponseDto }),
  )
}

export function CreateMediaListDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media list" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Created media list", type: MediaListDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Media list limit reached", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to create media list", type: ErrorResponseDto }),
  )
}

export function CreateMeidaListCloneDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Clone media list" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Cloned media list", type: MediaListDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not allowed to clone this list", type: ErrorResponseDto }),
  )
}

export function CreataMediaListLikeDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Like media list" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media list liked", type: MediaListLikeDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Cannot like own media list", type: ErrorResponseDto }),
  )
}

export function DeleteMediaLikeDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Unlike media list" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Media list unliked", type: MediaListLikeDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Cannot unlike own media list", type: ErrorResponseDto }),
  )
}

export function UpdateMediaListDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update media list" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Updated media list", type: MediaListDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner of media list", type: ErrorResponseDto }),
  )
}

export function DeleteMediaListDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media list" }),
    ApiSecurity("cookie"),
    ApiOkResponse({ description: "Deleted media list", type: MediaListDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner or system list", type: ErrorResponseDto }),
  )
}
