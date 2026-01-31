import { MediaItemTrackingDataType } from "@movie-tracker/types"

export const TrackingDataRepositorySymbol = Symbol("TrackingDataRepository")

export interface TrackingDataRepositoryInterface {
  getById: (id: string) => Promise<MediaItemTrackingDataType>

  update: (args: {
    id: string
    data: Partial<
      Omit<
        MediaItemTrackingDataType,
        "id" | "createdAt" | "updatedAt" | "mediaItemId"
      >
    >
  }) => Promise<MediaItemTrackingDataType>
}
