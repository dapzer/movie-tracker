import { api } from '~/api/instance';
import type { UserType } from '@movie-tracker/types';
import type { UserApiUpdateTypes } from '~/api/user/userApiTypes';

export const getUserProfileApi = async () => {
  return api.get<UserType>("user");
};

export const updateUserProfileApi = async (body: UserApiUpdateTypes) => {
  return api.patch<UserType>("user", body);
}
