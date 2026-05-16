import type {
  GetMediaItemsByListIdQueries,
  MediaItemsByListIdResponseType,
  MediaItemsCountByStatusQueries,
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
  MediaItemBulkCreateCloneApiTypes,
  MediaItemBulkDeleteApiTypes,
  MediaItemBulkUpdateTrackingDataApiTypes,
  MediaItemCreateApiTypes,
  MediaItemCreateCloneApiTypes,
  MediaItemTrackingDataUpdateApiArgs,
  MediaItemUpdateApiArgs,
} from "~/api/mediaItems/mediaItemsApiTypes"
import { api } from "~/api/instance"

function serializeYearRange(range?: [number | undefined, number | undefined]) {
  if (!range) {
    return undefined
  }

  return `${range[0] ?? ""},${range[1] ?? ""}`
}

export async function getMediaItemsApi(options?: RequestOptions) {
  return api.get<MediaItemType[]>("media-items", options)
}

export async function getMediaItemsByMediaIdApi(args: GetMediaItemsByMediaIdApiArgs, options?: RequestOptions) {
  return api.get<MediaItemType[]>(`media-items/by-media-id/${args.mediaId}`, options)
}

function serializeItemsFilters(args: GetMediaItemsByListIdQueries | MediaItemsCountByStatusQueries) {
  return {
    mediaTypes: args.mediaTypes?.join(","),
    rating: args.rating?.join(","),
    releaseYear: serializeYearRange(args.releaseYear),
    genres: args.genres?.join(","),
    releaseStatuses: args.releaseStatuses?.join(","),
  }
}

export async function getMediaItemsByMediaListIdApi(args: GetMediaItemsByMediaListIdApiArgs, options?: RequestOptions) {
  return api.get<MediaItemsByListIdResponseType>(`media-items/media-list/${args.mediaListId}`, {
    ...options,
    params: {
      limit: args.limit,
      offset: args.offset,
      search: args.search,
      status: args.status,
      ...serializeItemsFilters({
        mediaTypes: args.mediaTypes,
        rating: args.rating,
        releaseYear: args.releaseYear,
        genres: args.genres,
        releaseStatuses: args.releaseStatuses,
      }),
      sortBy: args.sortBy,
      sortDirection: args.sortDirection,
    },
  })
}

export async function getMediaItemsCountByMediaListIdApi(args: GetMediaItemsCountByMediaListIdApiArgs, options?: RequestOptions) {
  return api.get<MediaItemsCountByStatusType>(`media-items/media-list/${args.mediaListId}/count`, {
    ...options,
    params: {
      search: args.search,
      ...serializeItemsFilters({
        mediaTypes: args.mediaTypes,
        rating: args.rating,
        releaseYear: args.releaseYear,
        genres: args.genres,
        releaseStatuses: args.releaseStatuses,
      }),
    },
  })
}

export async function createMediaItemApi(body: MediaItemCreateApiTypes) {
  return api.post<MediaItemType>("media-items", body)
}

export async function deleteMediaItemApi(mediaItemId: string) {
  return api.delete<MediaItemType>(`media-items/${mediaItemId}`)
}

export async function updateMediaItemTrackingDataApi(args: MediaItemTrackingDataUpdateApiArgs) {
  return api.patch<MediaItemTrackingDataType>(`tracking-data/${args.trackingDataId}`, args.body)
}

export async function createMediaItemCloneApi(args: MediaItemCreateCloneApiTypes) {
  return api.post<MediaItemType>(`media-items/${args.mediaItemId}/clone`, {
    mediaListId: args.mediaListId,
    currentStatus: args.currentStatus,
    isSaveCreationDate: args.isSaveCreationDate,
  })
}

export async function bulkCreateMediaItemCloneApi(body: MediaItemBulkCreateCloneApiTypes) {
  return api.post<MediaItemType[]>("media-items/bulk/clone", body)
}

export async function updateMediaItemApi(args: MediaItemUpdateApiArgs) {
  return api.patch<MediaItemType>(`media-items/${args.mediaItemId}`, args.body)
}

export async function bulkCreateMediaItemsApi(body: MediaItemBulkCreateApiTypes) {
  return api.post<MediaItemType[]>("media-items/bulk", body)
}

export async function bulkDeleteMediaItemsApi(body: MediaItemBulkDeleteApiTypes) {
  return api.post<MediaItemType[]>("media-items/bulk/delete", body)
}

export async function bulkUpdateMediaItemTrackingDataApi(body: MediaItemBulkUpdateTrackingDataApiTypes) {
  return api.post<MediaItemTrackingDataType[]>("tracking-data/bulk/update", body)
}
