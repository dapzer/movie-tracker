import type { UserFollowInformationType, UserFollowingsPaginatedType } from "@movie-tracker/types"
import type { Ref } from "vue"
import type { GetUserFollowersApiArgs, GetUserFollowingsApiArgs } from "~/api/userFollow/userFollowApiTypes"
import { useRequestHeaders } from "#app"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import {
  createUserFollowApi,
  deleteUserFollowApi,
  getUserFollowersApi,
  getUserFollowInformationApi,
  getUserFollowingsApi,
} from "~/api/userFollow/userFollowApi"
import { UserFollowApiQueryKeys } from "~/api/userFollow/userFollowApiQueryKeys"

export function useGetUserFollowersApi(args: Ref<GetUserFollowersApiArgs>) {
  return useQuery({
    queryKey: [UserFollowApiQueryKeys.FOLLOWERS, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getUserFollowersApi(args.value, { headers })
    },
  })
}

export function useGetUserFollowingsApi(args: Ref<GetUserFollowingsApiArgs>) {
  return useQuery({
    queryKey: [UserFollowApiQueryKeys.FOLLOWINGS, args],
    queryFn: () => {
      const headers = useRequestHeaders(["cookie"])
      return getUserFollowingsApi(args.value, { headers })
    },
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [UserFollowApiQueryKeys.FOLLOWERS] }),
        queryClient.setQueryData([UserFollowApiQueryKeys.FOLLOW_INFORMATION, data.followingId], (oldData: UserFollowInformationType) => {
          if (!oldData) {
            return oldData
          }

          return {
            isFollowing: true,
            followersCount: oldData.followersCount + 1,
          }
        }),
        queryClient.setQueriesData<UserFollowingsPaginatedType>({
          queryKey: [UserFollowApiQueryKeys.FOLLOWINGS],
          exact: false,
        }, (oldData) => {
          if (!oldData) {
            return oldData
          }

          return {
            ...oldData,
            items: oldData.items.map((el) => {
              if (el?.followingUserProfile?.id === data.followingId) {
                return {
                  ...el,
                  followingUserProfile: {
                    ...el.followingUserProfile,
                    isFollowing: true,
                  },
                }
              }
              return el
            }),
          }
        }),
      ])
    },
  })
}

export function useDeleteUserFollowApi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [UserFollowApiQueryKeys.DELETE_FOLLOW],
    mutationFn: (id: string) => deleteUserFollowApi(id),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [UserFollowApiQueryKeys.FOLLOWERS] }),
        queryClient.setQueryData([UserFollowApiQueryKeys.FOLLOW_INFORMATION, data.followingId], (oldData: UserFollowInformationType) => {
          if (!oldData) {
            return oldData
          }

          return {
            isFollowing: false,
            followersCount: oldData.followersCount - 1,
          }
        }),
        queryClient.setQueriesData<UserFollowingsPaginatedType>({
          queryKey: [UserFollowApiQueryKeys.FOLLOWINGS],
          exact: false,
        }, (oldData) => {
          if (!oldData) {
            return oldData
          }

          return {
            ...oldData,
            items: oldData.items.map((el) => {
              if (el?.followingUserProfile?.id === data.followingId) {
                return {
                  ...el,
                  followingUserProfile: {
                    ...el.followingUserProfile,
                    isFollowing: false,
                  },
                }
              }
              return el
            }),
          }
        }),
      ])
    },
  })
}
