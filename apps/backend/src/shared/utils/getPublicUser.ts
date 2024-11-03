import type { UserPublicType, UserType } from '@movie-tracker/types';

export const getPublicUser = (
  user: UserType,
): UserPublicType => {
  return {
    id: user.id,
    name: user.name,
    image: user.image,
    createdAt: user.createdAt,
  };
};