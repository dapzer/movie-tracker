import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { getProfileApi, logoutApi, signInApi, signInCallbackApi } from "~/api/authApi";
import { AuthQueryKeys, MediaItemQueryKeys, MediaListQueryKeys } from "~/constants/queryKeys";

export const useSignInApi = () => useMutation({
  mutationKey: [AuthQueryKeys.SIGN_IN],
  mutationFn: async (provider: string) => await signInApi(provider)
});

export const useSignInCallbackApi = () => useMutation({
  mutationKey: [AuthQueryKeys.SIGN_IN_CALLBACK],
  mutationFn: async (args: { provider: string, code: string }) => await signInCallbackApi(args.provider, args.code)
});

export const useLogoutApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [AuthQueryKeys.LOGOUT],
    mutationFn: async () => await logoutApi(),
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: [AuthQueryKeys.USER_PROFILE] });
      await queryClient.resetQueries({ queryKey: [MediaListQueryKeys.GET_ALL] });
      await queryClient.resetQueries({ queryKey: [MediaItemQueryKeys.GET_ALL] });
    }
  });
};

export const useUserProfile = () => useQuery({
  queryKey: [AuthQueryKeys.USER_PROFILE],
  queryFn: async () => await getProfileApi(),
  retry: false
});

