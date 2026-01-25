import type { PaginationType, SortOrderEnum } from "../common"
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
  totalSubscriptionsCount: number
}

export interface GetReleaseSubscriptionsByUserIdQueries extends PaginationType {
  search?: string
  completed?: boolean
  mediaType?: MediaTypeEnum
  sortBy?: "createdAt" | "lastReleasedAt"
  sortDirection?: SortOrderEnum
}

export type CreateReleaseSubscriptionType = Pick<ReleaseSubscriptionType, "userId" | "mediaId" | "mediaType" | "mediaDetailsId">

export type UpdateReleaseSubscriptionType = Partial<Pick<ReleaseSubscriptionType, "completedAt" | "lastReleasedAt">>
