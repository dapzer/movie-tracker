import {
  CreateNotificationArgsType,
  NotificationCountType,
  NotificationResponseType,
  NotificationType,
} from "@movie-tracker/types"

export const NotificationRepositorySymbol = Symbol("NotificationRepository")

export interface NotificationRepositoryInterface {
  create: (args: CreateNotificationArgsType) => Promise<NotificationType>
  createBulk: (args: Array<CreateNotificationArgsType>) => Promise<Array<NotificationType>>
  getByUserId: (args: {
    userId: string
    limit: number
    offset: number
  }) => Promise<NotificationResponseType>
  markBulkAsRead: (args: {
    userId: string
    ids: Array<string>
  }) => Promise<Array<NotificationType>>
  markAllAsRead: (args: {
    userId: string
  }) => Promise<Array<NotificationType>>
  getCountByUserId: (args: {
    userId: string
  }) => Promise<NotificationCountType>
}
