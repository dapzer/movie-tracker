import {
  MediaReview,
  MediaReviewCreateBodyType,
  MediaReviewPaginatedType,
  MediaReviewStatus,
  MediaReviewUpdateBodyType,
  PaginationType,
} from "@movie-tracker/types"

export const MediaReviewRepositorySymbol = Symbol("MediaReviewRepository")

export interface MediaReviewRepositoryInterface {
  getById: (args: {
    id: string
    currentUserId?: string
  }) => Promise<MediaReview | undefined>

  getByUserIdAndMediaId: (args: {
    userId: string
    mediaId: number
    currentUserId?: string
  }) => Promise<MediaReview | undefined>

  getByMediaId: (args: {
    mediaId: number
    currentUserId?: string
    status?: MediaReviewStatus
  } & PaginationType) => Promise<MediaReviewPaginatedType>

  getByUserId: (args: {
    userId: string
    currentUserId?: string
    status?: MediaReviewStatus
  } & PaginationType) => Promise<MediaReviewPaginatedType>

  create: (args: {
    userId: string
  } & MediaReviewCreateBodyType) => Promise<MediaReview>

  update: (args: {
    id: string
  } & MediaReviewUpdateBodyType) => Promise<MediaReview>

  delete: (id: string) => Promise<MediaReview>

  getCount: () => Promise<number>
}
