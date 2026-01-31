import { MediaItemStatusNameEnum, MediaItemTrackingDataType, MediaItemType, MediaTypeEnum } from "@movie-tracker/types"

export const MediaItemRepositorySymbol = Symbol("MediaItemRepository")

export interface MediaItemRepositoryInterface {
  getAll: () => Promise<MediaItemType[]>

  getById: (id: string) => Promise<MediaItemType>

  getByListId: (mediaListId: string) => Promise<MediaItemType[]>

  getByUserId: (userId: string) => Promise<MediaItemType[]>

  create: (args: {
    mediaId: number
    mediaType: MediaTypeEnum
    mediaListId: string
    mediaDetailsId: string
    createdAt?: Date
    currentStatus?: MediaItemStatusNameEnum
  }) => Promise<MediaItemType>

  createWithExistedData: (args: {
    mediaId: number
    mediaType: MediaTypeEnum
    mediaListId: string
    mediaDetailsId: string
    trackingData: Omit<
      MediaItemTrackingDataType,
      "id" | "updatedAt" | "createdAt" | "mediaItemId"
    >
    createdAt?: Date
  }) => Promise<MediaItemType>

  delete: (id: string) => Promise<MediaItemType>

  update: (args: {
    id: string
    data: Partial<Pick<MediaItemType, "mediaDetailsId" | "mediaListId">>
  }) => Promise<MediaItemType>

  getAllCount: () => Promise<number>
}
