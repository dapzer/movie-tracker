import { UserPublicType } from "./user"

export const BanReasonValues = ["SPAM", "TOXICITY", "MSFW", "FRAUD", "OTHER"] as const
export type BanReason = typeof BanReasonValues[number]
export const UserBanStatusFilterValues = ["active", "expired", "revoked"] as const
export type UserBanStatusFilter = typeof UserBanStatusFilterValues[number]

export interface UserBan {
  id: string
  userId: string
  issuedBy?: string
  reason: BanReason
  comment?: string
  createdAt: Date
  revokedAt?: Date
  revokedBy?: string
  expiresAt?: Date
  userProfile?: UserPublicType
  issuerUserProfile?: UserPublicType
  revokerUserProfile?: UserPublicType
}

export interface UserBansPaginatedType {
  items: UserBan[]
  totalCount: number
}

export type UserBanCreateBodyType = Pick<UserBan, "userId" | "reason"> & { issuedBy: string } & Partial<Pick<UserBan, "comment" | "expiresAt">>

export interface UserBanRevokeBodyType {
  revokedBy: string
}
