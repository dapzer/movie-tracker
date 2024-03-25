import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { getProfileApi, logoutApi, signInApi, signInCallbackApi } from "~/api/auth/authApi";
import { AuthQueryKeys } from "~/api/auth/authApiQueryKeys";
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys";
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys";

export const useSignInApi = () => useMutation({
  mutationKey: [AuthQueryKeys.SIGN_IN],
  mutationFn: async (provider: string) => await signInApi(provider)
});

export const useSignInCallbackApi = () => useMutation({
  mutationKey: [AuthQueryKeys.SIGN_IN_CALLBACK],
  mutationFn: (args: { provider: string, code: string }) =>  signInCallbackApi(args.provider, args.code)
});

export const useLogoutApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [AuthQueryKeys.LOGOUT],
    mutationFn: () => logoutApi(),
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: [AuthQueryKeys.USER_PROFILE] });
      await queryClient.resetQueries({ queryKey: [MediaListQueryKeys.GET_ALL] });
      await queryClient.resetQueries({ queryKey: [MediaItemQueryKeys.GET_ALL] });
      await queryClient.resetQueries({ queryKey: [MediaListQueryKeys.GET_BY_ID] });
      await queryClient.resetQueries({ queryKey: [MediaItemQueryKeys.GET_BY_MEDIA_LIST_ID] });
    }
  });
};

export const useUserProfileApi = () => useQuery({
  queryKey: [AuthQueryKeys.USER_PROFILE],
  queryFn: () => getProfileApi(),
  retry: false
});

