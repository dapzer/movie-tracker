import { MediaItemTrackingDataType } from "@movie-tracker/types"

export const TrackingDataRepositorySymbol = Symbol()

export interface TrackingDataRepositoryInterface {
  getTrackingDataById: (id: string) => Promise<MediaItemTrackingDataType>

  updateTrackingData: (
    id: string,
    data: Partial<
      Omit<
        MediaItemTrackingDataType,
        "id" | "createdAt" | "updatedAt" | "mediaItemId"
      >
    >,
  ) => Promise<MediaItemTrackingDataType>
}
