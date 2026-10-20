import type { MediaItemTrackingDataType } from "@movie-tracker/types"

export interface GetTrackingDataByMediaItemIdApiArgs {
  mediaItemId: string
}

export interface TrackingDataUpdateApiArgs {
  trackingDataId: string
  body: MediaItemTrackingDataType
}

export interface TrackingDataBulkUpdateApiTypes {
  items: TrackingDataUpdateApiArgs[]
}
