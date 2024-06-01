export const AuthQueryKeys = {
  SIGN_IN: "auth/signIn",
  SIGN_UP: "auth/signUp",
  SIGN_IN_BY_PROVIDER: "auth/signInByProvider",
  SIGN_IN_CALLBACK: "auth/signInCallback",
  LOGOUT: "auth/logout",
  RECOVER_PASSWORD: "auth/recoverPassword",
  RESET_PASSWORD: "auth/resetPassword",
  REQUEST_CHANGE_EMAIL: "auth/requestChangeEmail",
  CONFIRM_CHANGE_EMAIL: "auth/confirmChangeEmail",
  REQUEST_EMAIL_CONFIRMATION: "auth/requestEmailConfirmation",
  CONFIRM_EMAIL: "auth/confirmEmail",
} as const;
