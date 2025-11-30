import type {
  UserFollowersPaginatedType,
  UserFollowInformationType,
  UserFollowingsPaginatedType,
  UserFollowType,
} from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type { GetUserFollowersApiArgs, GetUserFollowingsApiArgs } from "~/api/userFollow/userFollowApiTypes"
import { api } from "~/api/instance"

export function getUserFollowersApi(args: GetUserFollowersApiArgs, options?: RequestOptions) {
  return api.get<UserFollowersPaginatedType>(`user/${args.userId}/followers`, {
    params: {
      offset: args.offset,
      limit: args.limit,
    },
    ...options,
  })
}

export function getUserFollowingsApi(args: GetUserFollowingsApiArgs, options?: RequestOptions) {
  return api.get<UserFollowingsPaginatedType>(`user/${args.userId}/followings`, {
    params: {
      offset: args.offset,
      limit: args.limit,
    },
    ...options,
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
