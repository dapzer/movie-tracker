import type { MediaItemTrackingDataType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  GetTrackingDataByMediaItemIdApiArgs,
  TrackingDataBulkUpdateApiTypes,
  TrackingDataUpdateApiArgs,
} from "~/api/trackingData/trackingDataApiTypes"
import { api } from "~/api/instance"

export async function getTrackingDataByMediaItemIdApi(args: GetTrackingDataByMediaItemIdApiArgs, options?: RequestOptions) {
  return api.get<MediaItemTrackingDataType>(`tracking-data/by-media-item/${args.mediaItemId}`, options)
}

export async function updateTrackingDataApi(args: TrackingDataUpdateApiArgs) {
  return api.patch<MediaItemTrackingDataType>(`tracking-data/${args.trackingDataId}`, args.body)
}

export async function bulkUpdateTrackingDataApi(body: TrackingDataBulkUpdateApiTypes) {
  return api.post<MediaItemTrackingDataType[]>("tracking-data/bulk/update", body)
}
