import type { UserType } from "@movie-tracker/types"

export type UserApiUpdateTypes = Partial<Pick<UserType, "name" | "image">>
