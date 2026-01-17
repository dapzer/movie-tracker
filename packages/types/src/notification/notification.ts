import { MediaDetailsType, MediaListType } from "../media"
import { UserPublicType } from "../user"

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
  } | {
    type: NotificationTypeEnum.MEDIA_STATUS_UPDATE
    mediaDetailsId: string
    previousStatus: string
    currentStatus: string
  }

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
  } | {
    type: NotificationTypeEnum.MEDIA_STATUS_UPDATE
    mediaDetailsId: MediaDetailsType
    previousStatus: string
    currentStatus: string
  }

export interface CreateNotificationArgsType<T extends NotificationTypeEnum = NotificationTypeEnum> {
  userId: string
  type: T
  meta: Omit<Extract<NotificationMetaType, { type: T }>, "type">
  createdAt?: Date
}
