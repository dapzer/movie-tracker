import type { UseQueryOptions } from "@tanstack/vue-query"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { getUserProfileApi, getUserProfileByIdApi, getUserStatsByIdApi, updateUserProfileApi } from "~/api/user/userApi"
import { UserQueryKeys } from "~/api/user/userApiQueryKeys"

export function useGetUserProfileApi() {
  return useQuery({
    queryKey: [UserQueryKeys.PROFILE],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }
      return getUserProfileApi({ headers })
    },
    retry: false,
    retryOnMount: false,
  })
}

export function useGetUserProfileByIdApi(userId: string, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [UserQueryKeys.PROFILE_BY_ID, userId],
    queryFn: () => getUserProfileByIdApi(userId),
    retry: false,
    ...options,
  })
}

export function useGetUserStatsByIdApi(userId: string, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [UserQueryKeys.STATS_BY_ID, userId],
    queryFn: () => getUserStatsByIdApi(userId),
    retry: false,
    ...options,
  })
}

export function useUpdateUserProfileApi() {
  return useMutation({
    mutationKey: [UserQueryKeys.UPDATE_PROFILE],
    mutationFn: updateUserProfileApi,
  })
}
