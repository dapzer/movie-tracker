import { useLogoutApi, useUserProfile } from "~/composables/useAuthApi";
import { computed } from "vue";

export const useAuth = () => {
  const { data: profile, isLoading: isLoadingProfile, isSuccess: isProfileSuccess } = useUserProfile();
  const { mutateAsync: handleLogout, status: logoutStatus } = useLogoutApi();

  const isAuthorized = computed(() => {
    return !!profile.value;
  });

  const isProcessingLogout = computed(() => {
    return logoutStatus.value === "pending";
  })

  return { profile, isAuthorized, isLoadingProfile, isProfileSuccess, handleLogout, isProcessingLogout };
};
