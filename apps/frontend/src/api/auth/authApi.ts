import { api } from '~/api/instance';
import type {
  AuthApiRecoverPasswordTypes,
  AuthApiResetPasswordTypes,
  AuthApiSignInByProviderTypes,
  AuthApiSignInTypes,
  AuthApiSignUpTypes,
} from '~/api/auth/authApiTypes';

export const logoutApi = async () => {
  return api.post('auth/logout');
};

export const signInApi = async (body: AuthApiSignInTypes) => {
  return api.post('auth/sign-in', body);
};
export const signInByProviderApi = async (provider: string) => {
  return api.get<AuthApiSignInByProviderTypes>(`auth/oauth/connect/${provider}`);
};

export const signInCallbackApi = async (provider: string, code: string) => {
  return api.get(`auth/oauth/callback/${provider}`, {
    params: {
      code,
    },
  });
};

export const signUpApi = async (body: AuthApiSignUpTypes) => {
  return api.post('auth/sign-up', body);
};

export const recoverPasswordApi = async (body: AuthApiRecoverPasswordTypes) => {
  return api.post('auth/recover-password', body);
};

export const resetPasswordApi = async (body: AuthApiResetPasswordTypes) => {
  return api.post('auth/reset-password', body);
};

export const requestChangeEmailApi = async (email: string) => {
  return api.post('auth/change-email', {
    email,
  });
}

export const confirmChangeEmailApi = async (token: string) => {
  return api.patch('auth/change-email', {
    token,
  });
};

export const requestEmailConfirmationApi = async () => {
  return api.get('auth/confirm-email');
}

export const confirmEmailApi = async (token: string) => {
  return api.patch('auth/confirm-email', {
    token,
  });
}
