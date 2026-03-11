import type { UserPublicType, UserStatsType, UserType } from "@movie-tracker/types"
import type { RequestOptions } from "@movie-tracker/utils"
import type { UserApiUpdateTypes } from "~/api/users/usersApiTypes"
import { api } from "~/api/instance"

export async function getUserProfileApi(options?: RequestOptions) {
  return api.get<UserType>("users/me", options)
}

export async function getUserProfileByIdApi(userId: string, options?: RequestOptions) {
  return api.get<UserPublicType>(`users/${userId}`, options)
}

export async function getUserStatsByIdApi(userId: string, options?: RequestOptions) {
  return api.get<UserStatsType>(`users/${userId}/stats`, options)
}

export async function updateUserProfileApi(body: UserApiUpdateTypes) {
  return api.patch<UserType>("users", body)
}
