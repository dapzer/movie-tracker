import type {
  AuthApiRecoverPasswordTypes,
  AuthApiResetPasswordTypes,
  AuthApiSignInByProviderTypes,
  AuthApiSignInTypes,
  AuthApiSignUpTypes,
} from "~/api/auth/authApiTypes"
import { api } from "~/api/instance"

export async function logoutApi() {
  return api.post("auth/logout")
}

export async function signInApi(body: AuthApiSignInTypes) {
  return api.post("auth/sign-in", body)
}
export async function signInByProviderApi(provider: string) {
  return api.get<AuthApiSignInByProviderTypes>(`auth/oauth/connect/${provider}`)
}

export async function signInCallbackApi(provider: string, code: string) {
  return api.get(`auth/oauth/callback/${provider}`, {
    params: {
      code,
    },
  })
}

export async function signUpApi(body: AuthApiSignUpTypes) {
  return api.post("auth/sign-up", body)
}

export async function recoverPasswordApi(body: AuthApiRecoverPasswordTypes) {
  return api.post("auth/recover-password", body)
}

export async function resetPasswordApi(body: AuthApiResetPasswordTypes) {
  return api.post("auth/reset-password", body)
}

export async function requestChangeEmailApi(email: string) {
  return api.post("auth/change-email", {
    email,
  })
}

export async function confirmChangeEmailApi(token: string) {
  return api.patch("auth/change-email", {
    token,
  })
}

export async function requestEmailConfirmationApi() {
  return api.get("auth/confirm-email")
}

export async function confirmEmailApi(token: string) {
  return api.patch("auth/confirm-email", {
    token,
  })
}
