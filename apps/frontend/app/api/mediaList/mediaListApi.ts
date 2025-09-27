import type { MediaListLikeType, MediaListType, MediaListUpdateBodyType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  MediaListCreateCloneApiTypes,
  MediaListsGetApiTypes,
  MediaListUpdateApiTypes,
} from "~/api/mediaList/mediaListApiTypes"
import { api } from "~/api/instance"

export async function getMediaListsApi(args?: MediaListsGetApiTypes, options?: RequestOptions) {
  return api.get<MediaListType[]>("media-list", {
    ...options,
    params: {
      ...options?.params,
      userId: args?.userId,
    },
  })
}

export async function getMediaListsByIdApi(mediaListId: string, options?: RequestOptions) {
  return api.get<MediaListType>(`media-list/${mediaListId}`, options)
}

export async function createMediaListsApi(body: MediaListUpdateBodyType) {
  return api.post("media-list", body)
}

export async function createMediaListsCloneApi(id: string, body: MediaListCreateCloneApiTypes) {
  return api.post<MediaListType>(`media-list/${id}/clone`, body)
}

export async function deleteMediaListsApi(mediaListId: string) {
  return api.delete<MediaListType>(`media-list/${mediaListId}`)
}

export async function updateMediaListsApi(mediaListId: string, body: MediaListUpdateApiTypes) {
  return api.patch<MediaListType>(`media-list/${mediaListId}`, {
    ...body,
    title: body.title || null,
  })
}

export async function createLikeMediaListApi(mediaListId: string) {
  return api.post<MediaListLikeType>(`media-list/${mediaListId}/like`)
}

export async function deleteLikeMediaListApi(mediaListId: string) {
  return api.delete<MediaListLikeType>(`media-list/${mediaListId}/like`)
}
