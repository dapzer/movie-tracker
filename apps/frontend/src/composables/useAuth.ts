import { computed } from 'vue';
import { useLogoutApi } from '~/api/auth/useAuthApi';
import { useUserProfileApi } from '~/api/user/useUserApi';
import { useQueryClient } from "@tanstack/vue-query"
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys"
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys"
import { UserQueryKeys } from "~/api/user/userApiQueryKeys"

export const useAuth = () => {
  const userProfileApi = useUserProfileApi();
  const logoutApi = useLogoutApi();

  const isAuthorized = computed(() => {
    return !!userProfileApi.data.value;
  });

  const isProcessingLogout = computed(() => {
    return logoutApi.isPending.value;
  });

  const isNotAuthorized = computed(() => {
    return !isAuthorized.value && !userProfileApi.isLoading.value;
  });

  const isLoadingProfile = computed(() => {
    return userProfileApi.isPending.value
  });

  const isInitialLoadingProfile = computed(() => {
    return userProfileApi.isPending.value && userProfileApi.errorUpdateCount.value === 0;
  });
  const queryClient = useQueryClient();

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
    profile: userProfileApi.data,
    isLoadingProfile,
    isInitialLoadingProfile,
    isProfileSuccess: userProfileApi.isSuccess,
    handleLogout,
    handleRefetchProfile: userProfileApi.refetch,
    isAuthorized,
    isProcessingLogout,
    isNotAuthorized,
    suspenseProfile: userProfileApi.suspense,
  };
};
