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

import { CreateMediaListDto } from "@/services/mediaLists/dto/createMediaList.dto"
import { CreateMediaListCloneDto } from "@/services/mediaLists/dto/createMediaListClone.dto"
import { MediaListResDto } from "@/services/mediaLists/dto/mediaList.dto"
import { MediaListLikeResDto } from "@/services/mediaLists/dto/mediaListLike.res.dto"
import { UpdateMediaListDto } from "@/services/mediaLists/dto/updateMediaList.dto"
import { ErrorResponseDto } from "@/shared/dto/errorResponse.dto"

export function MediaListsControllerDocs() {
  return applyDecorators(
    ApiTags("MediaLists"),
  )
}

export function GetMediaListsDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media lists" }),
    ApiOkResponse({ description: "Media lists", type: [MediaListResDto] }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch media lists", type: ErrorResponseDto }),
  )
}

export function GetMediaListByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Get media list by id" }),
    ApiOkResponse({ description: "Media list", type: MediaListResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Private list access denied", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to fetch media list", type: ErrorResponseDto }),
  )
}

export function CreateMediaListDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Create media list" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: CreateMediaListDto }),
    ApiOkResponse({ description: "Created media list", type: MediaListResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Media list limit reached", type: ErrorResponseDto }),
    ApiInternalServerErrorResponse({ description: "Failed to create media list", type: ErrorResponseDto }),
  )
}

export function CreateMeidaListCloneDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Clone media list" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: CreateMediaListCloneDto }),
    ApiOkResponse({ description: "Cloned media list", type: MediaListResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not allowed to clone this list", type: ErrorResponseDto }),
  )
}

export function CreataMediaListLikeDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Like media list" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Media list liked", type: MediaListLikeResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Cannot like own media list", type: ErrorResponseDto }),
  )
}

export function DeleteMediaLikeDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Unlike media list" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Media list unliked", type: MediaListLikeResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Cannot unlike own media list", type: ErrorResponseDto }),
  )
}

export function UpdateMediaListDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Update media list" }),
    ApiSecurity("oauth2"),
    ApiBody({ type: UpdateMediaListDto }),
    ApiOkResponse({ description: "Updated media list", type: MediaListResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner of media list", type: ErrorResponseDto }),
  )
}

export function DeleteMediaListDocs() {
  return applyDecorators(
    ApiOperation({ summary: "Delete media list" }),
    ApiSecurity("oauth2"),
    ApiOkResponse({ description: "Deleted media list", type: MediaListResDto }),
    ApiUnauthorizedResponse({ description: "Unauthorized", type: ErrorResponseDto }),
    ApiForbiddenResponse({ description: "Not owner or system list", type: ErrorResponseDto }),
  )
}
