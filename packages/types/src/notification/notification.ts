import { MediaListType } from "../media"
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
  }

export interface CreateNotificationArgsType<T extends NotificationTypeEnum = NotificationTypeEnum> {
  userId: string
  type: T
  meta: Omit<Extract<NotificationMetaType, { type: T }>, "type">
  createdAt?: Date
}
