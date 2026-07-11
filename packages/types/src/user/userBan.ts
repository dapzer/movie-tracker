import { UserPublicType } from "./user"

export type BanReason = "SPAM" | "TOXICITY" | "MSFW" | "FRAUD" | "OTHER"

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

export type UserBanCreateBodyType = Pick<UserBan, "userId" | "issuedBy" | "reason"> & Partial<Pick<UserBan, "comment" | "expiresAt">>

export type UserBanRevokeBodyType = Pick<UserBan, "revokedBy"> & Partial<Pick<UserBan, "revokedAt">>
