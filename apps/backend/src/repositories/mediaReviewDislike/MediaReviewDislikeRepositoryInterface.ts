import {
  MediaReviewDislike,
  MediaReviewDislikeCreateBodyType,
} from "@movie-tracker/types"

export const MediaReviewDislikeRepositorySymbol = Symbol("MediaReviewDislikeRepository")

export interface MediaReviewDislikeRepositoryInterface {
  getById: (args: {
    id: string
  }) => Promise<MediaReviewDislike | undefined>

  getByUserIdAndReviewId: (args: {
    userId: string
    mediaReviewId: string
  }) => Promise<MediaReviewDislike | undefined>

  getByReviewId: (args: {
    mediaReviewId: string
  }) => Promise<MediaReviewDislike[]>

  create: (args: {
    userId: string
  } & MediaReviewDislikeCreateBodyType) => Promise<MediaReviewDislike>

  delete: (id: string) => Promise<MediaReviewDislike>
}
