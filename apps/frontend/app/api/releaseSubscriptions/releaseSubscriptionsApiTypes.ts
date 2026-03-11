import type { CreateReleaseSubscriptionType, GetReleaseSubscriptionsByUserIdQueries } from "@movie-tracker/types"

export interface GetReleaseSubscriptionByMediaIdArgs {
  mediaId: number
}

export type GetReleaseSubscriptionsByUserIdArgs = GetReleaseSubscriptionsByUserIdQueries

export type CreateReleaseSubscriptionBody = Pick<CreateReleaseSubscriptionType, "mediaId" | "mediaType">

export interface DeleteReleaseSubscriptionArgs {
  id: string
}
