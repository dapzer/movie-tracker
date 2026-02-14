import type { MediaItemTrackingDataType, MediaItemType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  GetMediaItemsByMediaIdApiArgs,
  MediaItemBulkCreateApiTypes,
  MediaItemBulkDeleteApiTypes,
  MediaItemBulkUpdateTrackingDataApiTypes,
  MediaItemCreateApiTypes,
  MediaItemCreateCloneApiTypes,
  MediaItemUpdateApiTypes,
} from "~/api/mediaItem/mediaItemApiTypes"
import { api } from "~/api/instance"

export async function getMediaItemsApi(options?: RequestOptions) {
  return api.get<MediaItemType[]>("media-item", options)
}

export async function getMediaItemsByMediaIdApi(args: GetMediaItemsByMediaIdApiArgs, options?: RequestOptions) {
  return api.get<MediaItemType[]>(`media-item/by-media-id/${args.mediaId}`, options)
}

export async function getMediaItemsByMediaListIdApi(mediaListId: string) {
  return api.get<MediaItemType[]>(`media-item/media-list/${mediaListId}`)
}

export async function createMediaItemApi(body: MediaItemCreateApiTypes) {
  return api.post<MediaItemType>("media-item", body)
}

export async function deleteMediaItemApi(mediaItemId: string) {
  return api.delete<MediaItemType>(`media-item/${mediaItemId}`)
}

export async function updateMediaItemTrackingDataApi(trackingDataId: string, body: MediaItemTrackingDataType) {
  return api.patch<MediaItemTrackingDataType>(`tracking-data/${trackingDataId}`, body)
}

export async function createMediaItemCloneApi(args: MediaItemCreateCloneApiTypes) {
  return api.post<MediaItemType>(`media-item/${args.mediaItemId}/clone`, {
    mediaListId: args.mediaListId,
    isSaveCreationDate: args.isSaveCreationDate,
  })
}

export async function updateMediaItemApi(mediaItemId: string, body: MediaItemUpdateApiTypes) {
  return api.patch<MediaItemType>(`media-item/${mediaItemId}`, body)
}

export async function bulkCreateMediaItemsApi(body: MediaItemBulkCreateApiTypes) {
  return api.post<MediaItemType[]>("media-item/bulk", body)
}

export async function bulkDeleteMediaItemsApi(body: MediaItemBulkDeleteApiTypes) {
  return api.post<MediaItemType[]>("media-item/bulk/delete", body)
}

export async function bulkUpdateMediaItemTrackingDataApi(body: MediaItemBulkUpdateTrackingDataApiTypes) {
  return api.post<MediaItemTrackingDataType[]>("tracking-data/bulk/update", body)
}
