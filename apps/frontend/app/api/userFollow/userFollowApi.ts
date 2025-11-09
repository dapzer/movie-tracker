import type { UserFollowersPaginatedType, UserFollowInformationType, UserFollowType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type { GetUserFollowersApiArgs } from "~/api/userFollow/userFollowApiTypes"
import { api } from "~/api/instance"

export function getUserFollowersApi(args: GetUserFollowersApiArgs) {
  return api.get<UserFollowersPaginatedType>(`user/${args.userId}/followers`, {
    params: {
      offset: args.offset,
      limit: args.limit,
    },
  })
}

export function getUserFollowInformationApi(id: string, options?: RequestOptions) {
  return api.get<UserFollowInformationType>(`user/${id}/follow-information`, options)
}

export function createUserFollowApi(id: string) {
  return api.post<UserFollowType>(`user/${id}/follow`)
}

export function deleteUserFollowApi(id: string) {
  return api.delete<UserFollowType>(`user/${id}/follow`)
}
