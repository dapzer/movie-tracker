import type { ReleaseSubscriptionsResponseType, ReleaseSubscriptionType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type {
  CreateReleaseSubscriptionBody,
  DeleteReleaseSubscriptionArgs,
  GetReleaseSubscriptionByMediaIdArgs,
  GetReleaseSubscriptionsByUserIdArgs,
} from "~/api/releaseSubscriptions/releaseSubscriptionsApiTypes"
import { api } from "~/api/instance"

export function getReleaseSubscriptionByMediaId(args: GetReleaseSubscriptionByMediaIdArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<ReleaseSubscriptionType>(`release-subscriptions/by-media/${args.mediaId}`, {
    ...options,
  })
}

export async function getReleaseSubscriptionsByUserId(args: GetReleaseSubscriptionsByUserIdArgs, options?: Omit<RequestOptions, "params">) {
  return api.get<ReleaseSubscriptionsResponseType>(`release-subscriptions`, {
    ...options,
    params: {
      limit: args.limit,
      offset: args.offset,
      search: args.search,
      completed: args.completed,
      mediaType: args.mediaType,
      sortBy: args.sortBy,
      sortDirection: args.sortDirection,
    },
  })
}

export function createReleaseSubscription(body: CreateReleaseSubscriptionBody) {
  return api.post<ReleaseSubscriptionType>("release-subscriptions", body)
}

export function deleteReleaseSubscription(args: DeleteReleaseSubscriptionArgs) {
  return api.delete<ReleaseSubscriptionType>(`release-subscriptions/${args.id}`)
}
