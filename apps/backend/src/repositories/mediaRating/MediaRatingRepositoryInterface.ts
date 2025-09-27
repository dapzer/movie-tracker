import { MediaRatingCreateBodyType, MediaRatingType, MediaRatingUpdateBodyType } from "@movie-tracker/types"

export const MediaRatingRepositorySymbol = Symbol("MediaRatingRepository")

export interface MediaRatingRepositoryInterface {
  getAllMediaRatings: () => Promise<MediaRatingType[]>

  getMediaRatingById: (args: Pick<MediaRatingType, "id">) => Promise<MediaRatingType | undefined>

  getMediaRatingByUserIdAndMediaId: (
    args: {
      userId: string
    } & Pick<MediaRatingType, "mediaId">
  ) => Promise<MediaRatingType | undefined>

  getMediaRatingsByUserId: (args: { userId: string }) => Promise<MediaRatingType[]>

  getMediaRatingsByUserIdAndMediaIds: (
    args: {
      userId: string
      mediaIds: number[]
    }
  ) => Promise<MediaRatingType[] | undefined>

  createMediaRating: (
    args: {
      userId: string
    } & MediaRatingCreateBodyType
  ) => Promise<MediaRatingType>

  updateMediaRating: (
    args: {
      id: string
    } & MediaRatingUpdateBodyType
  ) => Promise<MediaRatingType>

  deleteMediaRating: (id: string) => Promise<MediaRatingType>

  getMediaRatingsCount: () => Promise<number>
}
