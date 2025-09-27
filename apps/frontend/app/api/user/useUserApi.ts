import type { UseQueryOptions } from "@tanstack/vue-query"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { getUserProfileApi, getUserProfileByIdApi, updateUserProfileApi } from "~/api/user/userApi"
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
    ...options,
  })
}

export function useUpdateUserProfileApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [UserQueryKeys.UPDATE_PROFILE],
    mutationFn: updateUserProfileApi,
    onSuccess: async (data) => {
      await queryClient.setQueryData([UserQueryKeys.PROFILE], () => {
        return data
      })
    },
  })
}
