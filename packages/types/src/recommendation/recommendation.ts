import type { MediaDetailsType, MediaTypeEnum } from "../media"

export interface RecommendationInputItemType {
  title: string
  originalTitle?: string
  releaseYear?: number
  mediaType: MediaTypeEnum
  rating?: number
  review?: string
  note?: string
}

export interface RecommendationItemType {
  title: string
  releaseYear: number
  mediaType: MediaTypeEnum
  reason: string
  mediaDetails?: MediaDetailsType
}

export interface RecommendationSessionType {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface StoredRecommendationType extends RecommendationItemType {
  id: string
  sessionId: string
  mediaId: number
  mediaDetailsId: string
  createdAt: Date
}

export interface GenerateRecommendationsBodyType {
  items: RecommendationInputItemType[]
  count?: number
}

export interface RecommendationResponseType {
  sessionId: string
  recommendations: RecommendationItemType[]
}
