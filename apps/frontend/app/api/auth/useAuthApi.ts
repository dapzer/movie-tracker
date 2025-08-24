import type { AuthApiSignInTypes } from "~/api/auth/authApiTypes"
import { useMutation } from "@tanstack/vue-query"
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
} from "~/api/auth/authApi"
import { AuthQueryKeys } from "~/api/auth/authApiQueryKeys"

export function useSignInApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.SIGN_IN],
    mutationFn: async (body: AuthApiSignInTypes) => await signInApi(body),
  })
}

export function useSignInByProviderApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.SIGN_IN_BY_PROVIDER],
    mutationFn: async (provider: string) => await signInByProviderApi(provider),
  })
}

export function useSignInCallbackApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.SIGN_IN_CALLBACK],
    mutationFn: (args: { provider: string, code: string }) => signInCallbackApi(args.provider, args.code),
  })
}

export function useLogoutApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.LOGOUT],
    mutationFn: () => logoutApi(),
  })
}

export function useSignUpApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.SIGN_UP],
    mutationFn: signUpApi,
  })
}

export function useRecoverPasswordApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.RECOVER_PASSWORD],
    mutationFn: recoverPasswordApi,
  })
}

export function useResetPasswordApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.RESET_PASSWORD],
    mutationFn: resetPasswordApi,
  })
}

export function useRequestChangeEmailApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.REQUEST_CHANGE_EMAIL],
    mutationFn: requestChangeEmailApi,
  })
}

export function useConfirmChangeEmailApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.CONFIRM_CHANGE_EMAIL],
    mutationFn: confirmChangeEmailApi,
  })
}

export function useRequestEmailConfirmationApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.REQUEST_EMAIL_CONFIRMATION],
    mutationFn: requestEmailConfirmationApi,
  })
}

export function useConfirmEmailApi() {
  return useMutation({
    mutationKey: [AuthQueryKeys.CONFIRM_EMAIL],
    mutationFn: confirmEmailApi,
  })
}
