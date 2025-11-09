import type { PaginationType } from "@movie-tracker/types"

export interface GetUserFollowersApiArgs extends PaginationType {
  userId: string
}
