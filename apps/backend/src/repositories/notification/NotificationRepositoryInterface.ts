import { CreateNotificationArgsType, NotificationResponseType, NotificationType } from "@movie-tracker/types"

export const NotificationRepositorySymbol = Symbol("NotificationRepository")

export interface NotificationRepositoryInterface {
  createNotification: (args: CreateNotificationArgsType) => Promise<NotificationType>
  getNotificationsByUserId: (args: { userId: string, limit: number, offset: number }) => Promise<NotificationResponseType>
  markNotificationsAsRead: (args: { userId: string, ids: Array<string> }) => Promise<Array<NotificationType>>
}
