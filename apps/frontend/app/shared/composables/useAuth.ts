import { useQueryClient } from "@tanstack/vue-query"
import { computed } from "vue"
import { useLogoutApi } from "~/api/auth/useAuthApi"
import { MediaItemsQueryKeys } from "~/api/mediaItems/mediaItemsApiQueryKeys"
import { MediaListsQueryKeys } from "~/api/mediaLists/mediaListsApiQueryKeys"
import { UsersQueryKeys } from "~/api/users/usersApiQueryKeys"
import { useGetUserProfileApi } from "~/api/users/useUsersApi"

export function useAuth() {
  const getUserProfileApi = useGetUserProfileApi()
  const logoutApi = useLogoutApi()

  const isAuthorized = computed(() => {
    return !!getUserProfileApi.data.value
  })

  const isProcessingLogout = computed(() => {
    return logoutApi.isPending.value
  })

  const isNotAuthorized = computed(() => {
    return !isAuthorized.value && !getUserProfileApi.isLoading.value
  })

  const isLoadingProfile = computed(() => {
    return getUserProfileApi.isPending.value
  })

  const isInitialLoadingProfile = computed(() => {
    return getUserProfileApi.isPending.value && getUserProfileApi.errorUpdateCount.value === 0
  })
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    await logoutApi.mutateAsync()

    await Promise.all([
      queryClient.resetQueries({ queryKey: [UsersQueryKeys.PROFILE] }),
      queryClient.resetQueries({ queryKey: [MediaListsQueryKeys.GET_ALL] }),
      queryClient.resetQueries({ queryKey: [MediaItemsQueryKeys.GET_ALL] }),
      queryClient.resetQueries({ queryKey: [MediaListsQueryKeys.GET_BY_ID] }),
      queryClient.resetQueries({ queryKey: [MediaItemsQueryKeys.GET_BY_MEDIA_LIST_ID] }),
    ])
  }

  return {
    profile: getUserProfileApi.data,
    isLoadingProfile,
    isInitialLoadingProfile,
    isProfileSuccess: getUserProfileApi.isSuccess,
    handleLogout,
    handleRefetchProfile: getUserProfileApi.refetch,
    isAuthorized,
    isProcessingLogout,
    isNotAuthorized,
    suspenseProfile: getUserProfileApi.suspense,
    getUserProfileApi,
  }
}
