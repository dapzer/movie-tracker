export interface AuthApiSignInTypes  {
  email: string
  password: string
}

export interface AuthApiSignInByProviderTypes {
  url: string
}

export interface AuthApiSignUpTypes {
  email: string
  password: string
  name: string
}

export interface AuthApiRecoverPasswordTypes {
  email: string
}

export interface AuthApiResetPasswordTypes {
  token: string
  password: string
}
