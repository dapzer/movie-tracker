import { api } from '~/api/instance';
import type { UserPublicType, UserType } from '@movie-tracker/types';
import type { UserApiUpdateTypes } from '~/api/user/userApiTypes';
import type { RequestOptions } from "@movie-tracker/utils"

export const getUserProfileApi = async (options?: RequestOptions) => {
  return api.get<UserType>("user", options);
};

export const getUserProfileByIdApi = async (userId: string, options?: RequestOptions) => {
  return api.get<UserPublicType>(`user/${userId}`, options);
};

export const updateUserProfileApi = async (body: UserApiUpdateTypes) => {
  return api.patch<UserType>("user", body);
}
