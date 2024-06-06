import { computed } from 'vue';
import { useLogoutApi } from '~/api/auth/useAuthApi';
import { useUserProfileApi } from '~/api/user/useUserApi';

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

  return {
    profile: userProfileApi.data,
    isLoadingProfile,
    isInitialLoadingProfile,
    isProfileSuccess: userProfileApi.isSuccess,
    handleLogout: logoutApi.mutateAsync,
    handleRefetchProfile: userProfileApi.refetch,
    isAuthorized,
    isProcessingLogout,
    isNotAuthorized,
  };
};
