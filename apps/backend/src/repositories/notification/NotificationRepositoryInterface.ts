import {
  CreateNotificationArgsType,
  NotificationCountType,
  NotificationResponseType,
  NotificationType,
} from "@movie-tracker/types"

export const NotificationRepositorySymbol = Symbol("NotificationRepository")

export interface NotificationRepositoryInterface {
  createNotification: (args: CreateNotificationArgsType) => Promise<NotificationType>
  createBulkNotifications: (args: Array<CreateNotificationArgsType>) => Promise<Array<NotificationType>>
  getNotificationsByUserId: (args: { userId: string, limit: number, offset: number }) => Promise<NotificationResponseType>
  markNotificationsAsRead: (args: { userId: string, ids: Array<string> }) => Promise<Array<NotificationType>>
  markAllNotificationsAsRead: (args: { userId: string }) => Promise<Array<NotificationType>>
  getNotificationCount: (args: { userId: string }) => Promise<NotificationCountType>
}
