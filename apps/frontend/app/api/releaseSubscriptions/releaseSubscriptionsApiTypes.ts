import type { CreateReleaseSubscriptionType, GetReleaseSubscriptionsByUserIdQueries, MediaTypeEnum } from "@movie-tracker/types"

export interface GetReleaseSubscriptionByMediaIdArgs {
  mediaId: number
  mediaType: MediaTypeEnum
}

export type GetReleaseSubscriptionsByUserIdArgs = GetReleaseSubscriptionsByUserIdQueries

export type CreateReleaseSubscriptionBody = Pick<CreateReleaseSubscriptionType, "mediaId" | "mediaType">

export interface DeleteReleaseSubscriptionArgs {
  id: string
}
