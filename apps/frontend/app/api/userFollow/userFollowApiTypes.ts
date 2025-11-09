import type { PaginationType } from "@movie-tracker/types"

export interface GetUserFollowersApiArgs extends PaginationType {
  userId: string
}

export interface GetUserFollowingsApiArgs extends PaginationType {
  userId: string
}
