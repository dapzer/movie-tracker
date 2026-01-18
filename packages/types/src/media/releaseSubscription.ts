import type { MediaDetailsType } from "./mediaDetails"
import { MediaTypeEnum } from "./mediaItem"

export interface ReleaseSubscriptionType {
  id: string
  mediaId: number
  mediaType: MediaTypeEnum
  mediaDetailsId: string
  userId: string
  lastReleasedAt: Date | null
  completedAt: Date | null
  createdAt: Date
}

export interface ReleaseSubscriptionWithDetailsType extends ReleaseSubscriptionType {
  mediaDetails: MediaDetailsType
}

export interface ReleaseSubscriptionsResponseType {
  items: ReleaseSubscriptionWithDetailsType[]
  totalCount: number
}

export type CreateReleaseSubscriptionType = Pick<ReleaseSubscriptionType, "userId" | "mediaId" | "mediaType" | "mediaDetailsId">

export type UpdateReleaseSubscriptionType = Partial<Pick<ReleaseSubscriptionType, "completedAt" | "lastReleasedAt">>
