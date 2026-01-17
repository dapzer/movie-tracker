import type { MediaDetailsType } from "./mediaDetails"

export interface ReleaseSubscriptionType {
  id: string
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

export type CreateReleaseSubscriptionType = Pick<ReleaseSubscriptionType, "userId" | "mediaDetailsId">

export type UpdateReleaseSubscriptionType = Partial<Pick<ReleaseSubscriptionType, "completedAt" | "lastReleasedAt">>
