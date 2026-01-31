import { MediaRatingCreateBodyType, MediaRatingType, MediaRatingUpdateBodyType } from "@movie-tracker/types"

export const MediaRatingRepositorySymbol = Symbol("MediaRatingRepository")

export interface MediaRatingRepositoryInterface {
  getAll: () => Promise<MediaRatingType[]>

  getById: (args: {
    id: string
  }) => Promise<MediaRatingType | undefined>

  getByUserIdAndMediaId: (args: {
    userId: string
    mediaId: number
  }) => Promise<MediaRatingType | undefined>

  getByUserId: (args: {
    userId: string
  }) => Promise<MediaRatingType[]>

  getByUserIdAndMediaIds: (args: {
    userId: string
    mediaIds: number[]
  }) => Promise<MediaRatingType[] | undefined>

  create: (args: {
    userId: string
  } & MediaRatingCreateBodyType) => Promise<MediaRatingType>

  update: (args: {
    id: string
  } & MediaRatingUpdateBodyType) => Promise<MediaRatingType>

  delete: (id: string) => Promise<MediaRatingType>

  getCount: () => Promise<number>
}
