import { MediaRatingCreateBodyType, MediaRatingType, MediaRatingUpdateBodyType } from "@movie-tracker/types"

export const MediaRatingRepositorySymbol = Symbol("MediaRatingRepository")

export interface MediaRatingRepositoryInterface {
  getMediaRatingId: (args: Pick<MediaRatingType, "id">) => Promise<MediaRatingType | undefined>

  getMediaRatingByUserId: (
    args: {
      userId: string
    } & Pick<MediaRatingType, "mediaId" | "mediaType">
  ) => Promise<MediaRatingType | undefined>

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
