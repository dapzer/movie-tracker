import { computed } from 'vue';
import { useLogoutApi, useUserProfileApi } from '~/api/auth/useAuthApi';

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

  return {
    profile: userProfileApi.data,
    isLoadingProfile: userProfileApi.isLoading,
    isProfileSuccess: userProfileApi.isSuccess,
    handleLogout: logoutApi.mutateAsync,
    isAuthorized,
    isProcessingLogout,
    isNotAuthorized,
  };
};
