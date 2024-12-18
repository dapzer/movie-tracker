import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  confirmChangeEmailApi,
  confirmEmailApi,
  logoutApi,
  recoverPasswordApi,
  requestChangeEmailApi,
  requestEmailConfirmationApi,
  resetPasswordApi,
  signInApi,
  signInByProviderApi,
  signInCallbackApi,
  signUpApi,
} from '~/api/auth/authApi';
import { AuthQueryKeys } from "~/api/auth/authApiQueryKeys";
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
  mutationFn: (args: { provider: string, code: string }) => signInCallbackApi(args.provider, args.code)
});

export const useLogoutApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [AuthQueryKeys.LOGOUT],
    mutationFn: () => logoutApi(),
  });
};

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

export const useRequestChangeEmailApi = () => useMutation({
  mutationKey: [AuthQueryKeys.REQUEST_CHANGE_EMAIL],
  mutationFn: requestChangeEmailApi
});

export const useConfirmChangeEmailApi = () => useMutation({
  mutationKey: [AuthQueryKeys.CONFIRM_CHANGE_EMAIL],
  mutationFn: confirmChangeEmailApi
});

export const useRequestEmailConfirmationApi = () => useMutation({
  mutationKey: [AuthQueryKeys.REQUEST_EMAIL_CONFIRMATION],
  mutationFn: requestEmailConfirmationApi
});

export const useConfirmEmailApi = () => useMutation({
  mutationKey: [AuthQueryKeys.CONFIRM_EMAIL],
  mutationFn: confirmEmailApi
});
