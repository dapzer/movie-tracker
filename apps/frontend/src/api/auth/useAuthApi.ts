import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  getProfileApi,
  logoutApi,
  recoverPasswordApi,
  resetPasswordApi,
  signInApi,
  signInByProviderApi,
  signInCallbackApi,
  signUpApi,
} from '~/api/auth/authApi';
import { AuthQueryKeys } from "~/api/auth/authApiQueryKeys";
import { MediaListQueryKeys } from "~/api/mediaList/mediaListApiQueryKeys";
import { MediaItemQueryKeys } from "~/api/mediaItem/mediaItemApiQueryKeys";
import type { AuthApiSignInTypes } from '~/api/auth/authApiTypes';

export const useSignInApi = () => useMutation({
  mutationKey: [AuthQueryKeys.SIGN_IN],
  mutationFn: async (body: AuthApiSignInTypes) => await signInApi(body)
});

export const useSignInByProviderApi = () => useMutation({
  mutationKey: [AuthQueryKeys.SIGN_IN_BY_PROVIDER],
  mutationFn: async (provider: string) => await signInByProviderApi(provider)
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
  retry: false,
  refetchOnWindowFocus: false,
});


export const useSignUpApi = () => useMutation({
  mutationKey: [AuthQueryKeys.SIGN_UP],
  mutationFn: signUpApi
});

export const useRecoverPasswordApi = () => useMutation({
  mutationKey: [AuthQueryKeys.RECOVER_PASSWORD],
  mutationFn: recoverPasswordApi
});

export const useResetPasswordApi = () => useMutation({
  mutationKey: [AuthQueryKeys.RESET_PASSWORD],
  mutationFn: resetPasswordApi
});
