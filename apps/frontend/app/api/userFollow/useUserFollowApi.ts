import type { UserFollowInformationType } from "@movie-tracker/types"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  createUserFollowApi,
  deleteUserFollowApi,
  getUserFollowersApi,
  getUserFollowInformationApi,
} from "~/api/userFollow/userFollowApi"
import { UserFollowApiQueryKeys } from "~/api/userFollow/userFollowApiQueryKeys"

export function useGetUserFollowersApi(id: string) {
  return useQuery({
    queryKey: [UserFollowApiQueryKeys.FOLLOWERS, id],
    queryFn: () => getUserFollowersApi(id),
  })
}

export function useGetUserFollowInformationApi(id: string) {
  return useQuery({
    queryKey: [UserFollowApiQueryKeys.FOLLOW_INFORMATION, id],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getUserFollowInformationApi(id, { headers })
    },
  })
}

export function useCreateUserFollowApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [UserFollowApiQueryKeys.CREATE_FOLLOW],
    mutationFn: (id: string) => createUserFollowApi(id),
    onSuccess: async (data) => {
      await queryClient.setQueryData([UserFollowApiQueryKeys.FOLLOW_INFORMATION, data.followingId], (oldData: UserFollowInformationType) => {
        return {
          isFollowing: true,
          followersCount: oldData.followersCount + 1,
        }
      })
      await queryClient.invalidateQueries({ queryKey: [UserFollowApiQueryKeys.FOLLOWERS, data.followerId] })
    },
  })
}

export function useDeleteUserFollowApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [UserFollowApiQueryKeys.DELETE_FOLLOW],
    mutationFn: (id: string) => deleteUserFollowApi(id),
    onSuccess: async (data) => {
      await queryClient.setQueryData([UserFollowApiQueryKeys.FOLLOW_INFORMATION, data.followingId], (oldData: UserFollowInformationType) => {
        return {
          isFollowing: false,
          followersCount: oldData.followersCount - 1,
        }
      })
      await queryClient.invalidateQueries({ queryKey: [UserFollowApiQueryKeys.FOLLOWERS, data.followerId] })
    },
  })
}
