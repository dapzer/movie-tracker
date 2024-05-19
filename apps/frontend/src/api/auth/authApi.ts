import type { UserType } from "@movie-tracker/types";
import { api } from "~/api/instance";
import type { AuthApiSignInByProviderTypes, AuthApiSignInTypes, AuthApiSignUpTypes } from '~/api/auth/authApiTypes';

export const getProfileApi = async () => {
  return api.get<UserType>("user");
};

export const logoutApi = async () => {
  return api.post("auth/logout");
};

export const signInApi = async (body: AuthApiSignInTypes) => {
  return api.post("auth/signIn", body);
}
export const signInByProviderApi = async (provider: string) => {
  return api.get<AuthApiSignInByProviderTypes>(`auth/oauth/connect/${provider}`);
};

export const signInCallbackApi = async (provider: string, code: string) => {
  return api.get(`auth/oauth/callback/${provider}`, {
    params: {
      code
    }
  });
};

export const signUpApi = async (body: AuthApiSignUpTypes) => {
  return api.post("auth/signup", body);
}
