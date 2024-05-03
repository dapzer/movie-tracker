import { UserType } from '@movie-tracker/types';

export const getUserWithoutPassword = (
  user: UserType,
): Omit<UserType, 'password'> => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    roles: user.roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isEmailVerified: user.isEmailVerified,
  };
};
