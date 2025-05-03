import { useQueryClient } from "@tanstack/vue-query"
import { computed } from "vue"
import { useLogoutApi } from "~/api/auth/useAuthApi"
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys"
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys"
import { UserQueryKeys } from "~/api/user/userApiQueryKeys"
import { useGetUserProfileApi } from "~/api/user/useUserApi"

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
      queryClient.resetQueries({ queryKey: [UserQueryKeys.PROFILE] }),
      queryClient.resetQueries({ queryKey: [MediaListQueryKeys.GET_ALL] }),
      queryClient.resetQueries({ queryKey: [MediaItemQueryKeys.GET_ALL] }),
      queryClient.resetQueries({ queryKey: [MediaListQueryKeys.GET_BY_ID] }),
      queryClient.resetQueries({ queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID] }),
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
