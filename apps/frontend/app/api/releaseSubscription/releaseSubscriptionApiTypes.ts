import type { CreateReleaseSubscriptionType, PaginationType } from "@movie-tracker/types"

export interface GetReleaseSubscriptionByMediaIdArgs {
  mediaId: number
}

export type GetReleaseSubscriptionsByUserIdArgs = PaginationType & {
  search?: string
}

export type CreateReleaseSubscriptionBody = Pick<CreateReleaseSubscriptionType, "mediaId" | "mediaType">

export interface DeleteReleaseSubscriptionArgs {
  id: string
}
