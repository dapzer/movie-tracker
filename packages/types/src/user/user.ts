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
  mediaRatingsCount?: number
  mediaListLikeCount: number
}

export type UserPublicType = Pick<UserType, "id" | "name" | "image" | "createdAt">

export type ManagedUserType = Pick<
  UserType,
  "id" | "name" | "image" | "roles" | "email" | "signUpMethod" | "createdAt" | "updatedAt"
> & {
  isBanned: boolean
}

export interface UserPaginatedType {
  items: ManagedUserType[]
  totalCount: number
}
