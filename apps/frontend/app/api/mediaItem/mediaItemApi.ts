import type {
  MediaItemsByListIdResponseType,
  MediaItemsCountByStatusType,
  MediaItemTrackingDataType,
  MediaItemType,
} from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  GetMediaItemsByMediaIdApiArgs,
  GetMediaItemsByMediaListIdApiArgs,
  GetMediaItemsCountByMediaListIdApiArgs,
  MediaItemBulkCreateApiTypes,
  MediaItemBulkDeleteApiTypes,
  MediaItemBulkUpdateTrackingDataApiTypes,
  MediaItemCreateApiTypes,
  MediaItemCreateCloneApiTypes,
  MediaItemTrackingDataUpdateApiArgs,
  MediaItemUpdateApiArgs,
} from "~/api/mediaItem/mediaItemApiTypes"
import { api } from "~/api/instance"

export async function getMediaItemsApi(options?: RequestOptions) {
  return api.get<MediaItemType[]>("media-item", options)
}

export async function getMediaItemsByMediaIdApi(args: GetMediaItemsByMediaIdApiArgs, options?: RequestOptions) {
  return api.get<MediaItemType[]>(`media-item/by-media-id/${args.mediaId}`, options)
}

export async function getMediaItemsByMediaListIdApi(args: GetMediaItemsByMediaListIdApiArgs, options?: RequestOptions) {
  return api.get<MediaItemsByListIdResponseType>(`media-item/media-list/${args.mediaListId}`, {
    ...options,
    params: {
      limit: args.limit,
      offset: args.offset,
      search: args.search,
      status: args.status,
      mediaType: args.mediaType,
      sortBy: args.sortBy,
      sortDirection: args.sortDirection,
    },
  })
}

export async function getMediaItemsCountByMediaListIdApi(args: GetMediaItemsCountByMediaListIdApiArgs, options?: RequestOptions) {
  return api.get<MediaItemsCountByStatusType>(`media-item/media-list/${args.mediaListId}/count`, {
    ...options,
    params: {
      search: args.search,
    },
  })
}

export async function createMediaItemApi(body: MediaItemCreateApiTypes) {
  return api.post<MediaItemType>("media-item", body)
}

export async function deleteMediaItemApi(mediaItemId: string) {
  return api.delete<MediaItemType>(`media-item/${mediaItemId}`)
}

export async function updateMediaItemTrackingDataApi(args: MediaItemTrackingDataUpdateApiArgs) {
  return api.patch<MediaItemTrackingDataType>(`tracking-data/${args.trackingDataId}`, args.body)
}

export async function createMediaItemCloneApi(args: MediaItemCreateCloneApiTypes) {
  return api.post<MediaItemType>(`media-item/${args.mediaItemId}/clone`, {
    mediaListId: args.mediaListId,
    isSaveCreationDate: args.isSaveCreationDate,
  })
}

export async function updateMediaItemApi(args: MediaItemUpdateApiArgs) {
  return api.patch<MediaItemType>(`media-item/${args.mediaItemId}`, args.body)
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
