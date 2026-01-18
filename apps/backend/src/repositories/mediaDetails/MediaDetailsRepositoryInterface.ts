import { MediaDetailsInfoType, MediaDetailsType, MediaTypeEnum } from "@movie-tracker/types"

export const MediaDetailsRepositorySymbol = Symbol("MediaDetailsRepository")

export interface MediaDetailsRepositoryInterface {
  getByMediaIds: (
    args: {
      mediaIds: number[]
    }
  ) => Promise<MediaDetailsType[]>

  create: (
    args: {
      mediaId: number
      mediaType: MediaTypeEnum
      mediaDetailsInfoRu: MediaDetailsInfoType
      mediaDetailsInfoEn: MediaDetailsInfoType
      score: number
    }
  ) => Promise<MediaDetailsType>

  update: (
    args: {
      mediaId: number
      mediaType: MediaTypeEnum
      mediaDetailsInfoRu: MediaDetailsInfoType
      mediaDetailsInfoEn: MediaDetailsInfoType
      score: number
    }
  ) => Promise<MediaDetailsType>

  getByMediaData: (
    args: {
      mediaId: number
      mediaType: MediaTypeEnum
    }
  ) => Promise<MediaDetailsType>

  getCount: () => Promise<number>

  getAll: () => Promise<MediaDetailsType[]>
}
