import type { UseQueryOptions } from "@tanstack/vue-query"
import type { Ref } from "vue"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery } from "@tanstack/vue-query"
import { getUserProfileApi, getUserProfileByIdApi, updateUserProfileApi } from "~/api/user/userApi"
import { UserQueryKeys } from "~/api/user/userApiQueryKeys"

export function useUserProfileApi() {
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
  })
}

export function useUserProfileByIdApi(userId: Ref<string>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [UserQueryKeys.PROFILE_BY_ID],
    queryFn: () => getUserProfileByIdApi(userId.value),
    ...options,
  })
}

export function useUpdateUserProfileApi() {
  return useMutation({
    mutationKey: [UserQueryKeys.UPDATE_PROFILE],
    mutationFn: updateUserProfileApi,
  })
}
