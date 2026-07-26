import { MediaDetailsType, MediaListType, MediaReviewModerationLogAction, MediaReviewModerationLogReason } from "../media"
import { BanReason, UserPublicType } from "../user"

export interface NotificationType {
  id: string
  userId: string
  type: NotificationTypeEnum
  meta: NotificationMetaType | NotificationMetaResponseType
  readAt: Date | undefined
  createdAt: Date
}

export interface NotificationResponseType {
  items: NotificationType[]
  totalCount: number
}

export interface NotificationCountType {
  unread: number
}

export enum NotificationTypeEnum {
  MEDIA_LIST_LIKE = "MEDIA_LIST_LIKE",
  USER_FOLLOW = "USER_FOLLOW",
  MEDIA_RELEASE = "MEDIA_RELEASE",
  MEDIA_STATUS_UPDATE = "MEDIA_STATUS_UPDATE",
  MEDIA_REVIEW_MODERATION_UPDATE = "MEDIA_REVIEW_MODERATION_UPDATE",
  USER_BAN_CREATED = "USER_BAN_CREATED",
  USER_BAN_REVOKED = "USER_BAN_REVOKED",
}

export interface NotificationMediaReleaseEpisodeType {
  seasonNumber: number
  episodeNumber: number
}

export type NotificationMetaType
  = | {
    type: NotificationTypeEnum.USER_FOLLOW
    actorUserId: string
  }
  | {
    type: NotificationTypeEnum.MEDIA_LIST_LIKE
    actorUserId: string
    mediaListId: string
    mediaListLikeId: string
  } | {
    type: NotificationTypeEnum.MEDIA_RELEASE
    mediaDetailsId: string
    episodes?: NotificationMediaReleaseEpisodeType[]
  } | {
    type: NotificationTypeEnum.MEDIA_STATUS_UPDATE
    mediaDetailsId: string
    previousStatus: string
    currentStatus: string
  } | {
    type: NotificationTypeEnum.MEDIA_REVIEW_MODERATION_UPDATE
    mediaReviewId: string
    mediaDetailsId: string
    action: MediaReviewModerationLogAction
    reason?: MediaReviewModerationLogReason
  } | {
    type: NotificationTypeEnum.USER_BAN_CREATED
    userBanId: string
    reason: BanReason
    expiresAt?: Date
  } | {
    type: NotificationTypeEnum.USER_BAN_REVOKED
    userBanId: string
  }

export type ExtractNotificationMetaType<T extends NotificationTypeEnum> = Extract<NotificationMetaType, { type: T }>

export type NotificationMediaListType = Pick<MediaListType, "id" | "title">

export type NotificationUserType = Pick<UserPublicType, "id" | "image" | "name">

export type NotificationMetaResponseType
  = | {
    type: NotificationTypeEnum.USER_FOLLOW
    actorUser: NotificationUserType
  }
  | {
    type: NotificationTypeEnum.MEDIA_LIST_LIKE
    actorUser: NotificationUserType
    mediaList: NotificationMediaListType
  } | {
    type: NotificationTypeEnum.MEDIA_RELEASE
    mediaDetails: MediaDetailsType
    episodes?: NotificationMediaReleaseEpisodeType[]
  } | {
    type: NotificationTypeEnum.MEDIA_STATUS_UPDATE
    mediaDetails: MediaDetailsType
    previousStatus: string
    currentStatus: string
  } | {
    type: NotificationTypeEnum.MEDIA_REVIEW_MODERATION_UPDATE
    mediaReviewId: string
    mediaDetails: MediaDetailsType
    action: MediaReviewModerationLogAction
    reason?: MediaReviewModerationLogReason
  } | {
    type: NotificationTypeEnum.USER_BAN_CREATED
    userBanId: string
    reason: BanReason
    expiresAt?: Date
  } | {
    type: NotificationTypeEnum.USER_BAN_REVOKED
    userBanId: string
  }

export type ExtractNotificationMetaResponseType<T extends NotificationTypeEnum> = Extract<NotificationMetaResponseType, { type: T }>

export interface CreateNotificationArgsType<T extends NotificationTypeEnum = NotificationTypeEnum> {
  userId: string
  type: T
  meta: Omit<Extract<NotificationMetaType, { type: T }>, "type">
  createdAt?: Date
}
