import { UserPublicType } from "./user"

export type BanReason = "SPAM" | "TOXICITY" | "MSFW" | "FRAUD" | "OTHER"
export const UserBanStatusFilterValues = ["active", "expired", "revoked"] as const
export type UserBanStatusFilter = typeof UserBanStatusFilterValues[number]

export interface UserBan {
  id: string
  userId: string
  issuedBy: string
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

export type UserBanCreateBodyType = Pick<UserBan, "userId" | "issuedBy" | "reason"> & Partial<Pick<UserBan, "comment" | "expiresAt">>

export type UserBanRevokeBodyType = Pick<UserBan, "revokedBy"> & Partial<Pick<UserBan, "revokedAt">>
