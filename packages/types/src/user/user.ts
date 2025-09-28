export enum UserRoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum SignUpMethodEnum {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
  VK = "VK",
  YANDEX = "YANDEX",
}

export enum UserMediaRatingsAccessLevelEnum {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export interface UserType {
  id: string
  // userName: string;
  name: string
  email?: string
  image?: string
  isEmailVerified: boolean
  signUpMethod: SignUpMethodEnum
  password?: string
  mediaRatingsAccessLevel?: UserMediaRatingsAccessLevelEnum
  roles: UserRoleEnum[]
  createdAt: Date
  updatedAt: Date
}

export interface UserStatsType {
  mediaListCount: number
  mediaRatingsCount: number
  mediaListLikeCount: number
}

export type UserPublicType = Omit<UserType, "password" | "email" | "roles" | "updatedAt" | "isEmailVerified" | "signUpMethod">
