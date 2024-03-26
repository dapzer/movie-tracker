import type { UserType } from "@movie-tracker/types";
import { api } from "~/api/instance";
import type { AuthApiSignInTypes } from "~/api/auth/authApiTypes";

export const getProfileApi = async () => {
  return api.get<UserType>("user");
};

export const logoutApi = async () => {
  return api.post("auth/logout");
};

export const signInApi = async (provider: string) => {
  return api.get<AuthApiSignInTypes>(`auth/login/${provider}`);
};

export const signInCallbackApi = async (provider: string, code: string) => {
  return api.get(`auth/callback/${provider}`, {
    params: {
      code
    }
  });
};
