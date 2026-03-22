import { UserPublicType } from "../user"
import { MediaDetailsType } from "./mediaDetails"
import { MediaTypeEnum } from "./mediaItem"

export enum MediaReviewStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PUBLISHED = "PUBLISHED",
  REMOVED = "REMOVED",
  DELETED = "DELETED",
}

export enum MediaReviewRemoveReason {
  OFF_TOPIC = "OFF_TOPIC",
  SPAM = "SPAM",
  TOXICITY = "TOXICITY",
  LOW_EFFORT_JUNK = "LOW_EFFORT_JUNK",
  OTHER = "OTHER",
}

export interface MediaReview {
  id: string
  userId: string
  user?: UserPublicType
  mediaId: number
  mediaType: MediaTypeEnum
  mediaDetailsId: string
  mediaDetails?: MediaDetailsType
  title: string
  content: string
  isSpoiler: boolean
  status: MediaReviewStatus
  publishedAt?: Date
  removeReason?: MediaReviewRemoveReason
  removedAt?: Date
  createdAt: Date
  updatedAt: Date

  likesCount?: number
  dislikesCount?: number
  isLiked?: boolean
  isDisliked?: boolean
}

export type MediaReviewCreateBodyType = Pick<MediaReview, "mediaId"
  | "mediaType"
  | "mediaDetailsId"
  | "title"
  | "content"
  | "isSpoiler">

export type MediaReviewUpdateBodyType = Pick<MediaReview, "isSpoiler"
  | "status"
  | "publishedAt"
  | "removeReason"
  | "removedAt">

export interface MediaReviewLike {
  id: string
  userId: string
  mediaId: number
  mediaType: MediaTypeEnum
  mediaDetailsId: string
  mediaReviewId: string
  createdAt: Date
}

export type MediaReviewLikeCreateBodyType = Pick<MediaReviewLike, "mediaId"
  | "mediaType"
  | "mediaDetailsId"
  | "mediaReviewId">

export interface MediaReviewDislike {
  id: string
  userId: string
  mediaId: number
  mediaType: MediaTypeEnum
  mediaDetailsId: string
  mediaReviewId: string
  createdAt: Date
}

export type MediaReviewDislikeCreateBodyType = Pick<MediaReviewDislike, "mediaId"
  | "mediaType"
  | "mediaDetailsId"
  | "mediaReviewId">
