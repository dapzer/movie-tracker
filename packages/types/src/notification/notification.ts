import { MediaListLikeType, MediaListType } from "../media"
import { UserPublicType } from "../user"

export interface NotificationType {
  id: string
  userId: string
  type: NotificationTypeEnum
  meta: NotificationMetaType
  readAt: Date | undefined
  createdAt: Date
}

export type NotificationResponseType = Omit<NotificationType, "meta"> & {
  meta: NotificationMetaResponseType
}

export enum NotificationTypeEnum {
  MEDIA_LIST_LIKE = "MEDIA_LIST_LIKE",
  USER_FOLLOW = "USER_FOLLOW",
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
  }

export type NotificationMetaResponseType
  = | {
    type: NotificationTypeEnum.USER_FOLLOW
    actorUser: UserPublicType
  }
  | {
    type: NotificationTypeEnum.MEDIA_LIST_LIKE
    actorUser: UserPublicType
    mediaList: MediaListType
    mediaListLike: MediaListLikeType | undefined
  }

export interface CreateNotificationArgsType<T extends NotificationTypeEnum = NotificationTypeEnum> {
  userId: string
  type: T
  meta: Omit<Extract<NotificationMetaType, { type: T }>, "type">
  createdAt?: Date
}
