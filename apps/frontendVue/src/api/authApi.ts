import type { UserType } from "@movie-tracker/types";
import { generateApiUrl } from "@movie-tracker/utils";
import { fetchWihCredentials } from "~/utils/fetchWihCredentials";

const getApiUrl = generateApiUrl(import.meta.env.VITE_API_URL || "");

export const getProfileApi = async () => {
  const response = await fetchWihCredentials(getApiUrl("/user"));
  const data = await response.json();

  if (response.ok) {
    return data as UserType;
  }

  throw new Error(`Error when getting profile. Code: ${data.statusCode}`);
};

export const logoutApi = async () => {
  const response = await fetchWihCredentials(getApiUrl("/auth/logout"), {
    method: "POST"
  });
  const data = await response.json();

  if (response.ok) {
    return;
  }

  throw new Error(`Error when logging out. Code: ${data.statusCode}`);
};

export const signInApi = async (provider: string) => {
  const response = await fetchWihCredentials(getApiUrl(`/auth/login/${provider}`));
  const data = await response.json();

  if (response.ok) {
    return data.url;
  }

  throw new Error(`Error when signing in. Code: ${data.statusCode}`);
};


export const signInCallbackApi = async (provider: string, code: string) => {
  const response = await fetchWihCredentials(getApiUrl(`/auth/callback/${provider}`, {
    code
  }), { method: "GET" });

  if (response.ok) {
    return null;
  }

  const data = await response.json();

  throw new Error(`Error when signing in. Code: ${data.statusCode}`);
};
