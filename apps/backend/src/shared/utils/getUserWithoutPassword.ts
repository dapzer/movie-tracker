import { UserType } from "@movie-tracker/types"

export function getUserWithoutPassword(user: UserType): Omit<UserType, "password"> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    roles: user.roles,
    signUpMethod: user.signUpMethod,
    mediaRatingsAccessLevel: user.mediaRatingsAccessLevel,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isEmailVerified: user.isEmailVerified,
  }
}
