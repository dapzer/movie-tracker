import { MediaDetailsInfoType, MediaDetailsType, MediaTypeEnum } from "@movie-tracker/types"

export const MediaDetailsRepositorySymbol = Symbol("MediaDetailsRepository")

export interface MediaDetailsRepositoryInterface {
  getMediaDetailsByMediaIds: (
    args: {
      mediaIds: number[]
    }
  ) => Promise<MediaDetailsType[]>

  createMediaDetails: (
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaDetailsInfoRu: MediaDetailsInfoType,
    mediaDetailsInfoEn: MediaDetailsInfoType,
    score: number,
  ) => Promise<MediaDetailsType>

  updateMediaDetails: (
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaDetailsInfoRu: MediaDetailsInfoType,
    mediaDetailsInfoEn: MediaDetailsInfoType,
    score: number,
  ) => Promise<MediaDetailsType>

  getMediaDetailsItem: (
    mediaId: number,
    mediaType: MediaTypeEnum,
  ) => Promise<MediaDetailsType>

  getMediaDetailsCount: () => Promise<number>

  getAllMediaDetails: () => Promise<MediaDetailsType[]>
}
