import { MediaDetailsType } from "./mediaDetails"
import { MediaTypeEnum } from "./mediaItem"

export interface MediaRatingType {
  id: string
  userId: string
  mediaId: number
  mediaType: MediaTypeEnum
  rating: number
  mediaDetails?: MediaDetailsType
  createdAt: Date
  updatedAt: Date
}

export type MediaRatingCreateBodyType = Pick<MediaRatingType, "mediaId" | "mediaType" | "rating">

export type MediaRatingUpdateBodyType = Pick<MediaRatingType, "rating">

export interface MediaRatingByUserIdResponseType {
  items: MediaRatingType[]
  totalCount: number
}
