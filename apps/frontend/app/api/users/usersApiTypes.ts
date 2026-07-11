import type { PaginationType, UserType } from "@movie-tracker/types"

export type UserApiUpdateTypes = Partial<Pick<UserType, "name" | "image" | "mediaRatingsAccessLevel">>

export type GetUsersArgs = PaginationType
