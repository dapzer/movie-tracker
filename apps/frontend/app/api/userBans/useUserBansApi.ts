import type { UseQueryOptions } from "@tanstack/vue-query"
import type { Ref } from "vue"
import type {
  CreateUserBanArgs,
  GetUserBanByIdArgs,
  GetUserBansArgs,
  RevokeUserBanArgs,
} from "~/api/userBans/userBansApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { createUserBanApi, getUserBanByIdApi, getUserBansApi, revokeUserBanApi } from "~/api/userBans/userBansApi"
import { UserBansApiQueryKeys } from "~/api/userBans/userBansApiQueryKeys"
import { UsersQueryKeys } from "~/api/users/usersApiQueryKeys"

export function useGetUserBansApi(args: Ref<GetUserBansArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [UserBansApiQueryKeys.GET_LIST, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getUserBansApi(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useGetUserBanByIdApi(args: Ref<GetUserBanByIdArgs>, options?: Omit<UseQueryOptions, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: [UserBansApiQueryKeys.GET_BY_ID, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])

      if (!headers.cookie?.includes("session") && import.meta.server) {
        throw new Error("No session cookie found")
      }

      return getUserBanByIdApi(args.value, { headers })
    },
    retry: false,
    retryOnMount: false,
    ...options,
  })
}

export function useCreateUserBanApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [UserBansApiQueryKeys.CREATE],
    mutationFn: (args: CreateUserBanArgs) => createUserBanApi(args),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [UserBansApiQueryKeys.GET_LIST] }),
        queryClient.invalidateQueries({ queryKey: [UserBansApiQueryKeys.GET_BY_ID] }),
        queryClient.invalidateQueries({ queryKey: [UsersQueryKeys.LIST] }),
      ])
    },
  })
}

export function useRevokeUserBanApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [UserBansApiQueryKeys.REVOKE],
    mutationFn: (args: RevokeUserBanArgs) => revokeUserBanApi(args),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [UserBansApiQueryKeys.GET_LIST] }),
        queryClient.invalidateQueries({ queryKey: [UserBansApiQueryKeys.GET_BY_ID] }),
        queryClient.invalidateQueries({ queryKey: [UsersQueryKeys.LIST] }),
      ])
    },
  })
}
