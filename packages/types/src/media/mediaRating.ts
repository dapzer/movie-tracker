import { UserPublicType } from "../user"
import { MediaDetailsType } from "./mediaDetails"
import { MediaTypeEnum } from "./mediaItem"

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
