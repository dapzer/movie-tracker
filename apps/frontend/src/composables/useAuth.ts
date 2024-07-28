import { computed } from 'vue';
import { useLogoutApi } from '~/api/auth/useAuthApi';
import { useUserProfileApi } from '~/api/user/useUserApi';
import { useQueryClient } from "@tanstack/vue-query"
import { UserQueryKeys } from "~/api/user/userApiQueryKeys"
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys"
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys"

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
    await queryClient.resetQueries({
      queryKey: [
        UserQueryKeys.PROFILE,
        MediaListQueryKeys.GET_ALL,
        MediaItemQueryKeys.GET_ALL,
        MediaListQueryKeys.GET_BY_ID,
        MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID,
      ]
    })
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
