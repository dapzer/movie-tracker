import {
  MediaReviewLike,
  MediaReviewLikeCreateBodyType,
} from "@movie-tracker/types"

export const MediaReviewLikeRepositorySymbol = Symbol("MediaReviewLikeRepository")

export interface MediaReviewLikeRepositoryInterface {
  getById: (args: {
    id: string
  }) => Promise<MediaReviewLike | undefined>

  getByUserIdAndReviewId: (args: {
    userId: string
    mediaReviewId: string
  }) => Promise<MediaReviewLike | undefined>

  getByReviewId: (args: {
    mediaReviewId: string
  }) => Promise<MediaReviewLike[]>

  create: (args: {
    userId: string
  } & MediaReviewLikeCreateBodyType) => Promise<MediaReviewLike>

  delete: (id: string) => Promise<MediaReviewLike>
}
