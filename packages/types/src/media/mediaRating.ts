import { MediaTypeEnum } from "./mediaItem"

export interface MediaRatingType {
  id: string
  userId: string
  mediaId: number
  mediaType: MediaTypeEnum
  rating: number
  createdAt: Date
  updatedAt: Date
}

export type MediaRatingCreateBodyType = Pick<MediaRatingType, "mediaId" | "mediaType" | "rating">

export type MediaRatingUpdateBodyType = Pick<MediaRatingType, "rating">
