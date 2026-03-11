import type { UseQueryOptions } from "@tanstack/vue-query"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { getUserProfileApi, getUserProfileByIdApi, getUserStatsByIdApi, updateUserProfileApi } from "~/api/users/usersApi"
import { UsersQueryKeys } from "~/api/users/usersApiQueryKeys"

export function useGetUserProfileApi() {
  return useQuery({
    queryKey: [UsersQueryKeys.PROFILE],
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
    queryKey: [UsersQueryKeys.PROFILE_BY_ID, userId],
    queryFn: () => getUserProfileByIdApi(userId),
    retry: false,
    ...options,
  })
}

export function useGetUserStatsByIdApi(userId: string, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [UsersQueryKeys.STATS_BY_ID, userId],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getUserStatsByIdApi(userId, { headers })
    },
    retry: false,
    ...options,
  })
}

export function useUpdateUserProfileApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [UsersQueryKeys.UPDATE_PROFILE],
    mutationFn: updateUserProfileApi,
    onSuccess: async (data) => {
      await queryClient.setQueryData([UsersQueryKeys.PROFILE], () => {
        return data
      })
    },
  })
}
