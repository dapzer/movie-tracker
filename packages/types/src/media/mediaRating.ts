import type { PaginationType, SortOrderEnum } from "../common"
import type { UserPublicType } from "../user"
import type { MediaDetailsType } from "./mediaDetails"
import type { MediaTypeEnum } from "./mediaItem"

export interface MediaRatingType {
  id: string
  userId: string
  user?: UserPublicType
  mediaId: number
  mediaType: MediaTypeEnum
  rating: number
  mediaDetailsId: string
  mediaDetails?: MediaDetailsType
  createdAt: Date
  updatedAt: Date
}

export type MediaRatingCreateBodyType = Pick<MediaRatingType, "mediaId" | "mediaType" | "rating" | "mediaDetailsId">

export type MediaRatingUpdateBodyType = Pick<MediaRatingType, "rating">

export interface MediaRatingPaginatedType {
  items: MediaRatingType[]
  totalCount: number
}

export interface GetMediaRatingsByUserIdQueries extends PaginationType {
  search?: string
  mediaTypes?: MediaTypeEnum[]
  rating?: [number, number]
  sortBy?: "createdAt" | "updatedAt" | "rating"
  sortDirection?: SortOrderEnum
}
