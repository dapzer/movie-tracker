import {
  MediaDetailsCreateBodyType,
  MediaDetailsType,
  MediaDetailsUpdateBodyType,
  MediaTypeEnum,
} from "@movie-tracker/types"

export const MediaDetailsRepositorySymbol = Symbol("MediaDetailsRepository")

export interface MediaDetailsRepositoryInterface {
  getByMediaIds: (args: {
    mediaIds: number[]
  }) => Promise<MediaDetailsType[]>

  create: (args: MediaDetailsCreateBodyType) => Promise<MediaDetailsType>

  update: (args: {
    mediaId: number
  } & MediaDetailsUpdateBodyType) => Promise<MediaDetailsType>

  getByMediaData: (args: {
    mediaId: number
    mediaType: MediaTypeEnum
  }) => Promise<MediaDetailsType>

  getCount: () => Promise<number>

  getAll: () => Promise<MediaDetailsType[]>
}
